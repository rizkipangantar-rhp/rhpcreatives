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

// Lazy initialization — env vars are read at request time, not module load time.
// Keys are trimmed to remove any accidental whitespace/newlines.
function getSnap() {
  const serverKey = (process.env.MIDTRANS_SERVER_KEY ?? '').trim()
  const clientKey = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '').trim()
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'

  if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY is not set in environment')
  if (!clientKey) throw new Error('NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not set in environment')

  return new midtransClient.Snap({ isProduction, serverKey, clientKey })
}

export async function createSnapTransaction(params: SnapTransactionParams): Promise<{ token: string; redirect_url: string }> {
  const snap = getSnap()
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
  })
  return result as { token: string; redirect_url: string }
}
