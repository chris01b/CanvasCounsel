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
async function createTransaction(req, res) {
 
  // 3. Call PayPal to set up an authorization transaction
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'AUTHORIZE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '1.00'
      }
    }]
  });

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Return a successful response to the client with the order ID
  res.status(200).json({
    orderID: order.result.id
  });
}

async function completeTransaction(req, res) {

  // 2a. Get the order ID from the request body
  const orderID = req.body.orderID;

  // 3. Call PayPal to get the transaction details
  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Validate the transaction details are as expected
  if (order.result.purchase_units[0].amount.value !== '1.00') {
    return res.send(400);
  }

  // 6. Save the transaction in your database
  // await database.saveTransaction(orderID);

  // 7. Return a successful response to the client
  return res.send(200);
}

module.exports = {createTransaction, completeTransaction};
