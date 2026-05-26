// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client')

export type SnapTransactionParams = {
  orderId: string
  grossAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  itemId: string
  itemName: string
  itemPrice: number
}

type ChargeBase = {
  midtransOrderId: string
  grossAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  itemId: string
  itemName: string
}

type MidtransAction = { name: string; url: string; method?: string }

export type BankTransferResult = {
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_status: string
  va_numbers?: { bank: string; va_number: string }[]
  permata_va_number?: string
  biller_code?: string
  bill_key?: string
  expiry_time?: string
}

export type QRResult = {
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_status: string
  actions?: MidtransAction[]
  expiry_time?: string
}

export type EWalletResult = {
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_status: string
  actions?: MidtransAction[]
  expiry_time?: string
}

export type TransactionStatus = {
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_status: string
  fraud_status?: string
  gross_amount: string
  expiry_time?: string
}

function readKeys() {
  const serverKey = (process.env.MIDTRANS_SERVER_KEY ?? '').trim()
  const clientKey = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '').trim()
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  console.log('[midtrans] serverKey prefix:', serverKey ? serverKey.substring(0, 15) : '(EMPTY!)')
  console.log('[midtrans] clientKey prefix:', clientKey ? clientKey.substring(0, 15) : '(EMPTY!)')
  console.log('[midtrans] isProduction:', isProduction)
  if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY is not set in environment')
  if (!clientKey) throw new Error('NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not set in environment')
  return { serverKey, clientKey, isProduction }
}

function getSnap() {
  const { serverKey, clientKey, isProduction } = readKeys()
  return new midtransClient.Snap({ isProduction, serverKey, clientKey })
}

function getCoreApi() {
  const { serverKey, clientKey, isProduction } = readKeys()
  return new midtransClient.CoreApi({ isProduction, serverKey, clientKey })
}

function buildItemDetails(params: ChargeBase) {
  return {
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    item_details: [
      {
        id: params.itemId,
        price: params.grossAmount,
        quantity: 1,
        name: params.itemName.slice(0, 50),
      },
    ],
  }
}

export async function createSnapTransaction(params: SnapTransactionParams): Promise<{ token: string; redirect_url: string }> {
  const snap = getSnap()
  const baseUrl = (process.env.NEXTAUTH_URL ?? 'http://localhost:3001').replace(/\/$/, '')
  const result = await snap.createTransaction({
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    item_details: [
      {
        id: params.itemId,
        price: params.itemPrice,
        quantity: 1,
        name: params.itemName.slice(0, 50),
      },
    ],
    callbacks: {
      finish: `${baseUrl}/order/sukses/${params.orderId}`,
    },
  })
  return result as { token: string; redirect_url: string }
}

export async function createCCSnapToken(params: SnapTransactionParams): Promise<{ token: string; redirect_url: string }> {
  const snap = getSnap()
  const baseUrl = (process.env.NEXTAUTH_URL ?? 'http://localhost:3001').replace(/\/$/, '')
  const result = await snap.createTransaction({
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    item_details: [
      {
        id: params.itemId,
        price: params.itemPrice,
        quantity: 1,
        name: params.itemName.slice(0, 50),
      },
    ],
    enabled_payments: ['credit_card'],
    callbacks: {
      finish: `${baseUrl}/order/sukses/${params.orderId}`,
    },
  })
  return result as { token: string; redirect_url: string }
}

export async function chargeBankTransfer(
  params: ChargeBase & { bank: 'cimb' | 'bni' | 'bri' | 'mandiri' | 'permata' }
): Promise<BankTransferResult> {
  const core = getCoreApi()
  const base = buildItemDetails(params)

  let payment_type: string
  let bank_transfer: Record<string, unknown>

  if (params.bank === 'mandiri') {
    payment_type = 'echannel'
    bank_transfer = { echannel: { bill_info1: 'Payment', bill_info2: 'Online' } }
  } else if (params.bank === 'permata') {
    payment_type = 'permata'
    bank_transfer = {}
  } else {
    payment_type = 'bank_transfer'
    bank_transfer = { bank_transfer: { bank: params.bank } }
  }

  const body: Record<string, unknown> = {
    payment_type,
    transaction_details: { order_id: params.midtransOrderId, gross_amount: params.grossAmount },
    ...base,
    ...bank_transfer,
    custom_expiry: { order_time: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0700', expiry_duration: 15, unit: 'minute' },
  }

  const result = await core.charge(body)
  return result as BankTransferResult
}

export async function chargeQRIS(params: ChargeBase): Promise<QRResult> {
  const core = getCoreApi()
  const base = buildItemDetails(params)
  const result = await core.charge({
    payment_type: 'qris',
    transaction_details: { order_id: params.midtransOrderId, gross_amount: params.grossAmount },
    ...base,
    qris: { acquirer: 'gopay' },
    custom_expiry: { order_time: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0700', expiry_duration: 15, unit: 'minute' },
  })
  return result as QRResult
}

export async function chargeGoPay(params: ChargeBase): Promise<EWalletResult> {
  const core = getCoreApi()
  const base = buildItemDetails(params)
  const result = await core.charge({
    payment_type: 'gopay',
    transaction_details: { order_id: params.midtransOrderId, gross_amount: params.grossAmount },
    ...base,
    gopay: { enable_callback: false },
    custom_expiry: { order_time: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0700', expiry_duration: 15, unit: 'minute' },
  })
  return result as EWalletResult
}

export async function chargeShopeePay(params: ChargeBase): Promise<EWalletResult> {
  const core = getCoreApi()
  const base = buildItemDetails(params)
  const result = await core.charge({
    payment_type: 'shopeepay',
    transaction_details: { order_id: params.midtransOrderId, gross_amount: params.grossAmount },
    ...base,
    shopeepay: { callback_url: 'https://rhpcreatives.com' },
    custom_expiry: { order_time: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0700', expiry_duration: 15, unit: 'minute' },
  })
  return result as EWalletResult
}

export async function checkTransactionStatus(midtransOrderId: string): Promise<TransactionStatus> {
  const core = getCoreApi()
  const result = await core.transaction.status(midtransOrderId)
  return result as TransactionStatus
}
