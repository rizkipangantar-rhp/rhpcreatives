// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client')

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
})

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
