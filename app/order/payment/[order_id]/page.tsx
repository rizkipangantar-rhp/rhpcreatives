'use client'
import { useState, useEffect, useRef, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './payment.module.css'

type Order = {
  orderId: string
  name: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  totalPrice: number
  originalPrice: number
  discountAmount: number
  status: string
  createdAt: string
  paymentExpiry?: string
  midtransOrderId?: string
  paymentMethod?: string
  paymentBank?: string
  paymentVa?: string
  paymentBillerCode?: string
  paymentBillKey?: string
  paymentQrUrl?: string
  paymentDeepLink?: string
}

type ChargeResult = {
  method: string
  bank?: string
  va?: string
  billerCode?: string
  billKey?: string
  qrUrl?: string
  deepLink?: string
  expiry?: string
  midtransOrderId?: string
}

type TabKey = 'bank_transfer' | 'ewallet' | 'qris' | 'credit_card'
type BankKey = 'bca' | 'bni' | 'bri' | 'mandiri' | 'permata'
type EWalletKey = 'gopay' | 'shopeepay'

const BANKS: { key: BankKey; label: string; icon: string }[] = [
  { key: 'bca', label: 'BCA', icon: '🏦' },
  { key: 'bni', label: 'BNI', icon: '🏦' },
  { key: 'bri', label: 'BRI', icon: '🏦' },
  { key: 'mandiri', label: 'Mandiri', icon: '🏦' },
  { key: 'permata', label: 'Permata', icon: '🏦' },
]

const EWALLETS: { key: EWalletKey; label: string; icon: string }[] = [
  { key: 'gopay', label: 'GoPay', icon: '💚' },
  { key: 'shopeepay', label: 'ShopeePay', icon: '🧡' },
]

function fmt(price: number) {
  return `Rp${price.toLocaleString('id-ID')}`
}

function useCountdown(expiryIso: string | undefined) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const target = expiryIso ? new Date(expiryIso).getTime() : 0
    if (!target) return

    function tick() {
      setRemaining(Math.max(0, target - Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiryIso])

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  const display = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return { remaining, display, expired: remaining === 0 && !!expiryIso }
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void
        onPending: (result: unknown) => void
        onError: (result: unknown) => void
        onClose: () => void
      }) => void
    }
  }
}

export default function PaymentPage({ params }: { params: Promise<{ order_id: string }> }) {
  const { order_id } = use(params)
  const { tr, lang } = useLanguage()
  const p = tr.paymentPage
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('bank_transfer')
  const [selectedBank, setSelectedBank] = useState<BankKey | null>(null)
  const [selectedEWallet, setSelectedEWallet] = useState<EWalletKey | null>(null)
  const [chargeResult, setChargeResult] = useState<ChargeResult | null>(null)
  const [charging, setCharging] = useState(false)
  const [chargeError, setChargeError] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const [ccLoading, setCcLoading] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 24h expiry from order creation (if no Midtrans expiry yet)
  const expiryIso = order?.paymentExpiry ?? (order ? new Date(new Date(order.createdAt).getTime() + 24 * 3600 * 1000).toISOString() : undefined)
  const { display: countdownDisplay, expired } = useCountdown(expiryIso)

  // Load Snap.js for credit card tab
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    const existing = document.querySelector(`script[src="${snapUrl}"]`)
    if (existing) return
    const script = document.createElement('script')
    script.src = snapUrl
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '')
    script.async = true
    document.head.appendChild(script)
  }, [])

  // Fetch order on mount
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/payment/status/${order_id}`)
        if (!res.ok) throw new Error('Not found')
        const data: Order = await res.json()
        setOrder(data)

        // If already paid, redirect immediately
        if (data.status === 'paid' || data.status === 'completed') {
          router.replace(`/order/sukses/${order_id}`)
          return
        }

        // Restore existing charge state
        if (data.paymentMethod === 'bank_transfer' && data.paymentBank) {
          setActiveTab('bank_transfer')
          setSelectedBank(data.paymentBank as BankKey)
          setChargeResult({
            method: 'bank_transfer',
            bank: data.paymentBank,
            va: data.paymentVa,
            billerCode: data.paymentBillerCode,
            billKey: data.paymentBillKey,
            expiry: data.paymentExpiry,
            midtransOrderId: data.midtransOrderId,
          })
        } else if (data.paymentMethod === 'qris') {
          setActiveTab('qris')
          setChargeResult({ method: 'qris', qrUrl: data.paymentQrUrl, expiry: data.paymentExpiry, midtransOrderId: data.midtransOrderId })
        } else if (data.paymentMethod === 'gopay') {
          setActiveTab('ewallet')
          setSelectedEWallet('gopay')
          setChargeResult({ method: 'gopay', qrUrl: data.paymentQrUrl, deepLink: data.paymentDeepLink, expiry: data.paymentExpiry, midtransOrderId: data.midtransOrderId })
        } else if (data.paymentMethod === 'shopeepay') {
          setActiveTab('ewallet')
          setSelectedEWallet('shopeepay')
          setChargeResult({ method: 'shopeepay', qrUrl: data.paymentQrUrl, deepLink: data.paymentDeepLink, expiry: data.paymentExpiry, midtransOrderId: data.midtransOrderId })
        }
      } catch {
        setOrder(null)
      } finally {
        setLoadingOrder(false)
      }
    }
    fetchOrder()
  }, [order_id, router])

  // Poll status every 5s when there's an active charge
  const startPolling = useCallback(() => {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${order_id}`)
        if (!res.ok) return
        const data: Order = await res.json()
        if (data.status === 'paid' || data.status === 'completed') {
          clearInterval(pollRef.current!)
          pollRef.current = null
          router.push(`/order/sukses/${order_id}`)
        }
      } catch { /* silent */ }
    }, 5000)
  }, [order_id, router])

  useEffect(() => {
    if (chargeResult) startPolling()
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    }
  }, [chargeResult, startPolling])

  async function charge(method: 'bank_transfer' | 'qris' | 'gopay' | 'shopeepay', bank?: BankKey) {
    setCharging(true)
    setChargeError('')
    setChargeResult(null)
    try {
      const res = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order_id, method, bank }),
      })
      const data = await res.json()
      if (!res.ok) {
        setChargeError(data.detail || data.error || p.errorCharge)
        return
      }
      setChargeResult(data as ChargeResult)
    } catch {
      setChargeError(p.errorCharge)
    } finally {
      setCharging(false)
    }
  }

  async function handleBankSelect(bank: BankKey) {
    setSelectedBank(bank)
    await charge('bank_transfer', bank)
  }

  async function handleEWalletSelect(wallet: EWalletKey) {
    setSelectedEWallet(wallet)
    await charge(wallet)
  }

  async function handleQRIS() {
    await charge('qris')
  }

  async function handleCreditCard() {
    setCcLoading(true)
    setChargeError('')
    try {
      const res = await fetch(`/api/payment/snap-token/${order_id}`)
      const data = await res.json()
      if (!res.ok) {
        setChargeError(data.detail || data.error || p.errorCharge)
        setCcLoading(false)
        return
      }
      if (typeof window.snap === 'undefined') {
        setChargeError('Snap.js belum dimuat. Coba refresh.')
        setCcLoading(false)
        return
      }
      window.snap.pay(data.snapToken, {
        onSuccess: () => router.push(`/order/sukses/${order_id}`),
        onPending: () => router.push(`/order/sukses/${order_id}`),
        onError: () => { setChargeError(p.errorCharge); setCcLoading(false) },
        onClose: () => setCcLoading(false),
      })
    } catch {
      setChargeError(p.errorCharge)
      setCcLoading(false)
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    })
  }

  function getBankInstructions(bank: BankKey): string[] {
    const map: Record<BankKey, string[]> = {
      bca: p.bankInstructionsBCA,
      bni: p.bankInstructionsBNI,
      bri: p.bankInstructionsBRI,
      mandiri: p.bankInstructionsMandiri,
      permata: p.bankInstructionsPermata,
    }
    return map[bank] ?? []
  }

  // ── Render ──

  if (loadingOrder) {
    return (
      <main className={styles.page}>
        <div className={styles.blob1} /><div className={styles.blob2} />
        <div className={styles.container}>
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <span>{p.loadingPayment}</span>
          </div>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <div className={styles.blob1} /><div className={styles.blob2} />
        <div className={styles.container}>
          <div className={styles.expiredWrap}>
            <span className={styles.expiredIcon}>❌</span>
            <p className={styles.expiredTitle}>{tr.orderSuccess.notFoundTitle}</p>
            <p className={styles.expiredSub}>{tr.orderSuccess.notFoundSub}</p>
            <Link href="/order" className={styles.retryBtn}>{p.backToOrder}</Link>
          </div>
        </div>
      </main>
    )
  }

  const serviceName = lang === 'id' ? order.serviceNameId : order.serviceNameEn
  const packageName = lang === 'id' ? order.packageNameId : order.packageNameEn

  return (
    <main className={styles.page}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/order" className={styles.backLink}>← {p.backToOrder}</Link>
          <h1 className={styles.title}>{p.title}</h1>
        </div>

        <div className={styles.layout}>
          {/* ── Summary ── */}
          <aside>
            <div className={styles.summaryCard}>
              <p className={styles.summaryTitle}>{p.orderSummary}</p>
              <p className={styles.summaryService}>{serviceName}</p>
              <p className={styles.summaryPackage}>{packageName}</p>
              <div className={styles.summaryDivider} />
              {order.discountAmount > 0 && (
                <div className={styles.summaryRow}>
                  <span>{tr.orderPage.originalPrice}</span>
                  <span>{fmt(order.originalPrice)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className={styles.summaryRow}>
                  <span>{tr.orderPage.discount}</span>
                  <span>-{fmt(order.discountAmount)}</span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>{p.amountLabel}</span>
                <span>{fmt(order.totalPrice)}</span>
              </div>
              <div className={styles.summaryDivider} />
              <p className={styles.summaryId}>{p.orderIdLabel}: {order.orderId}</p>

              {/* Countdown */}
              <div className={styles.countdown}>
                <p className={styles.countdownLabel}>{p.countdownLabel}</p>
                {expired ? (
                  <p className={styles.countdownExpired}>{p.expiredTitle}</p>
                ) : (
                  <p className={styles.countdownTime}>{countdownDisplay}</p>
                )}
              </div>
            </div>
          </aside>

          {/* ── Payment panel ── */}
          <div className={styles.paymentCard}>
            {expired ? (
              <div className={styles.expiredWrap}>
                <span className={styles.expiredIcon}>⏰</span>
                <p className={styles.expiredTitle}>{p.expiredTitle}</p>
                <p className={styles.expiredSub}>{p.expiredSub}</p>
                <Link href="/order" className={styles.retryBtn}>{p.backToOrder}</Link>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className={styles.tabs}>
                  {([
                    ['bank_transfer', p.tabBankTransfer],
                    ['ewallet', p.tabEWallet],
                    ['qris', p.tabQRIS],
                    ['credit_card', p.tabCreditCard],
                  ] as [TabKey, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                      onClick={() => { setActiveTab(key); setChargeResult(null); setChargeError('') }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className={styles.tabContent}>
                  {chargeError && (
                    <div className={styles.errorMsg}>{chargeError}</div>
                  )}

                  {/* ── Bank Transfer ── */}
                  {activeTab === 'bank_transfer' && (
                    <>
                      <div className={styles.bankGrid}>
                        {BANKS.map(b => (
                          <button
                            key={b.key}
                            className={`${styles.bankBtn} ${selectedBank === b.key ? styles.bankBtnActive : ''}`}
                            onClick={() => handleBankSelect(b.key)}
                            disabled={charging}
                          >
                            <span className={styles.bankLogo}>{b.icon}</span>
                            {b.label}
                          </button>
                        ))}
                      </div>

                      {charging && selectedBank && (
                        <div className={styles.loadingWrap}>
                          <div className={styles.spinner} />
                          <span>{p.loadingPayment}</span>
                        </div>
                      )}

                      {chargeResult && chargeResult.method === 'bank_transfer' && !charging && (
                        <>
                          {chargeResult.bank === 'mandiri' ? (
                            <>
                              <div className={styles.vaBox}>
                                <p className={styles.vaLabel}>{p.billerCodeLabel}</p>
                                <div className={styles.vaRow}>
                                  <span className={styles.vaNumber}>{chargeResult.billerCode}</span>
                                  <button className={styles.copyBtn} onClick={() => copyText(chargeResult.billerCode!, 'billerCode')}>
                                    {copiedKey === 'billerCode' ? p.copied : p.copyBtn}
                                  </button>
                                </div>
                              </div>
                              <div className={styles.vaBox}>
                                <p className={styles.vaLabel}>{p.billKeyLabel}</p>
                                <div className={styles.vaRow}>
                                  <span className={styles.vaNumber}>{chargeResult.billKey}</span>
                                  <button className={styles.copyBtn} onClick={() => copyText(chargeResult.billKey!, 'billKey')}>
                                    {copiedKey === 'billKey' ? p.copied : p.copyBtn}
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className={styles.vaBox}>
                              <p className={styles.vaLabel}>{p.vaNumberLabel}</p>
                              <div className={styles.vaRow}>
                                <span className={styles.vaNumber}>{chargeResult.va}</span>
                                <button className={styles.copyBtn} onClick={() => copyText(chargeResult.va!, 'va')}>
                                  {copiedKey === 'va' ? p.copied : p.copyBtn}
                                </button>
                              </div>
                            </div>
                          )}

                          {selectedBank && (
                            <>
                              <p className={styles.instructionsTitle}>{p.instructionsTitle}</p>
                              <ol className={styles.instructionsList}>
                                {getBankInstructions(selectedBank).map((step, i) => (
                                  <li key={i} data-step={i + 1}>{step}</li>
                                ))}
                              </ol>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* ── E-Wallet ── */}
                  {activeTab === 'ewallet' && (
                    <>
                      <div className={styles.ewalletGrid}>
                        {EWALLETS.map(w => (
                          <button
                            key={w.key}
                            className={`${styles.ewalletBtn} ${selectedEWallet === w.key ? styles.ewalletBtnActive : ''}`}
                            onClick={() => handleEWalletSelect(w.key)}
                            disabled={charging}
                          >
                            <span className={styles.ewalletIcon}>{w.icon}</span>
                            {w.label}
                          </button>
                        ))}
                        <button className={styles.ewalletBtn} style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                          <span className={styles.ewalletIcon}>🔵</span>
                          OVO
                        </button>
                        <button className={styles.ewalletBtn} style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                          <span className={styles.ewalletIcon}>💙</span>
                          DANA
                        </button>
                      </div>

                      {charging && selectedEWallet && (
                        <div className={styles.loadingWrap}>
                          <div className={styles.spinner} />
                          <span>{p.loadingPayment}</span>
                        </div>
                      )}

                      {chargeResult && (chargeResult.method === 'gopay' || chargeResult.method === 'shopeepay') && !charging && (
                        <div className={styles.qrWrap}>
                          <p className={styles.qrSub}>{p.ewalletScanQR}</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {chargeResult.qrUrl && <img src={chargeResult.qrUrl} alt="QR Code" className={styles.qrImage} />}
                          {chargeResult.deepLink && (
                            <>
                              <p className={styles.qrSub}>{p.ewalletOrDeepLink}</p>
                              <a href={chargeResult.deepLink} className={styles.deepLinkBtn} target="_blank" rel="noopener noreferrer">
                                {p.ewalletOpenApp}
                              </a>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── QRIS ── */}
                  {activeTab === 'qris' && (
                    <>
                      {!chargeResult && !charging && (
                        <div className={styles.qrWrap}>
                          <p className={styles.qrSub}>{p.qrisSub}</p>
                          <button
                            className={styles.ccPayBtn}
                            onClick={handleQRIS}
                            disabled={charging}
                          >
                            Generate QRIS →
                          </button>
                        </div>
                      )}

                      {charging && (
                        <div className={styles.loadingWrap}>
                          <div className={styles.spinner} />
                          <span>{p.loadingPayment}</span>
                        </div>
                      )}

                      {chargeResult && chargeResult.method === 'qris' && !charging && (
                        <div className={styles.qrWrap}>
                          <p className={styles.qrSub}>{p.qrisSub}</p>
                          {chargeResult.qrUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={chargeResult.qrUrl} alt="QRIS" className={styles.qrImage} />
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Credit Card ── */}
                  {activeTab === 'credit_card' && (
                    <div className={styles.ccWrap}>
                      <span className={styles.ccIcon}>💳</span>
                      <p className={styles.ccTitle}>{p.ccTitle}</p>
                      <p className={styles.ccSub}>{p.ccSub}</p>
                      <button
                        className={styles.ccPayBtn}
                        onClick={handleCreditCard}
                        disabled={ccLoading}
                      >
                        {ccLoading ? '...' : p.ccPayBtn}
                      </button>
                    </div>
                  )}

                  {/* ── Status polling indicator ── */}
                  {chargeResult && !expired && (
                    <div className={styles.statusBar}>
                      <div className={styles.statusDot} />
                      <span>{p.statusChecking}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
