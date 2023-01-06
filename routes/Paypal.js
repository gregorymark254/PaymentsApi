const paypal = require("paypal-rest-sdk")
const router = require("express").Router()


//paypall intergration
paypal.configure({
    'mode' : 'sandbox',
    'client_id' : 'AWwyogLXvEdmMhqJfp9iX52fJVvn_0yNnudkcMQvwd4HATJFnpTMLpo1SHxDTh360l259n202yR_XkiF',
    'client_secret' : 'EOEsHGHl7HWi46TxJ7p581z6gRGgXahhRJ22c-UZcT5xdoXXdtV1lwqa0Xqdlo5hBQIyc8bILZZXLMSJ'
})

router.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:8080/success",
          "cancel_url": "http://localhost:8080/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "2.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "2.00"
          },
          "description": "Hat for the best team ever"
      }]
};

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "2.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
});


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
            }
        }
    }
    });
    
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router