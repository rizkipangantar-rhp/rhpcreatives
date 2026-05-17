// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client')

// Lazy initialization so env vars are read at request time, not module load time
function getSnap() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
  const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? ''

  if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY is not set')

  return new midtransClient.Snap({ isProduction, serverKey, clientKey })
}

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

export async function createSnapTransaction(params: SnapTransactionParams): Promise<{ token: string; redirect_url: string }> {
  const result = await getSnap().createTransaction({
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
