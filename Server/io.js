const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const paymentHandler = require('./paymentHandler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/paypal-transaction-complete'), (req, res) => {
  paymentHandler.completeTransaction(req, res);
}

app.get('/create-paypal-transaction', (req, res) => {
  paymentHandler.createTransaction(req, res);
});


http.listen(3000, () => {
  console.log('Listening on port 3000');
});

module.exports = io;
