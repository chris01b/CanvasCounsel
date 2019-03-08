// 1. Set up your server to make calls to PayPal

// 1a. Import the SDK package
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// 1b. Import the PayPal SDK client that was created in `Set up the Server SDK`.
/**
 *
 * PayPal HTTP client dependency
 */
const payPalClient = require('./payPalClient');

// 2. Set up your server to receive a call from the client
module.exports = async (req, res) => {

  // 2a. Get the order ID from the request body
  const orderID = req.body.orderID;
  console.log(orderID);

  // 3. Call PayPal to get the transaction details
  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
    console.log(order);
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.sendStatus(500);
  }

  // 5. Validate the transaction details are as expected
  if (order.result.purchase_units[0].amount.value !== '220.00') {
    return res.sendStatus(400);
  }

  // 6. Save the transaction in your database
  // await database.saveTransaction(orderID);

  // 7. Return a successful response to the client
  return res.sendStatus(200);
}
