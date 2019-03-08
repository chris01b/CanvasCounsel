import chromep from 'chrome-promise';

function log(message) {
  $( "#console" ).append( '<p>"' + message + '"</p>' );
}

$(document).ready(() => {
  paypal.Buttons({
      createOrder: function() {
        return fetch('http://localhost:3000/create-paypal-transaction')
          .then(function(res) {
            return res.json();
          }).then(function(data) {
            return data.orderID;
          });
      },
      onApprove: function(data, actions) {

      // Authorize the transaction
      actions.order.authorize().then(function(authorization) {

        // Get the authorization id
        var authorizationID = authorization.purchase_units[0]
          .payments.authorizations[0].id

        // Call your server to validate and capture the transaction
        return fetch('http://localhost:3000/paypal-transaction-complete', {
          method: 'post',
          body: JSON.stringify({
            orderID: data.orderID,
            authorizationID: authorizationID
          })
        });
      });
    }
  }).render('#paypal-button-container');
});
