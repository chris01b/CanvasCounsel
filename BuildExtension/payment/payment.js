import chromep from 'chrome-promise';

function log(message) {
  $( "#console" ).append( '<p>"' + message + '"</p>' );
}

$(document).ready(() => {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        log('Transaction completed by ' + details.payer.name.given_name);
        // Call your server to save the transaction
        return fetch('http://localhost:3000/paypal-transaction-complete', {
          method: 'post',
          body: JSON.stringify({
            orderID: data.orderID
          })
        });
      });
    }
  }).render('#paypal-button-container');
});
