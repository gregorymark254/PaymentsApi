const router = require("express").Router()
const axios = require("axios")
const mpesaPayments = require("../models/MpesaRoute")

//Genereting access token
router.get("/token", (req,res) => {
    generateToken()
})
  
const generateToken = async (req, res, next) => {

    const secret = process.env.MPESA_CONSUMER_SECRET
    const customer = process.env.MPESA_CONSUMER_KEY
    const auth = new Buffer.from(`${customer}:${secret}`).toString("base64")

    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: {
        authorization : `Basic ${auth}`
        }
    })
    .then((response) => {
        // console.log(response)
        token = response.data.access_token
        next()
    })
    .catch((err) => {
        console.log(err)
        console.log("error one")
        // res.status(400).json(err.message)
    })
}
  
//Sending stk push to customer
router.post("/stk", generateToken , async (req,res) => {
    const phone = req.body.phone
    const amount = req.body.amount

    const date = new Date()
    const timestamp = date.getFullYear() + 
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)

    const shortCode = process.env.MPESA_PAYBILL
    const passKey = process.env.MPESA_PASSKEY
    const password = new Buffer.from(shortCode + passKey + timestamp).toString("base64")


    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {    
            BusinessShortCode : shortCode,    
            Password : password,    
            Timestamp : timestamp,    
            TransactionType: "CustomerPayBillOnline", //customer buy goods online
            Amount : amount,    
            PartyA : `254${phone}`,    
            PartyB : shortCode,    
            PhoneNumber : `254${phone}`,    
            CallBackURL : "https://8d1c-197-248-224-74.eu.ngrok.io/api/v1/callBack",    
            AccountReference : "myaccount",    
            TransactionDesc : "Test"
        },
        {
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    )
    .then((data) => {
        console.log(data.data)
        res.status(200).json(data.data)
    })
    .catch((err) => {
        console.log(err.message)
    })
})


//callback url
router.post("/callBack" , (req,res) => {

    const callbackData = req.body
    console.log(callbackData)
    if (!callbackData.Body.stkCallback.CallbackMetadata) {
        console.log(callbackData.Body)
        return res.status(200).json("OK")
    }
    console.log(callbackData.Body.stkCallback.CallbackMetadata)
    res.status(200)

    const id = callbackData.Body.stkCallback.CallbackMetadata.Item[3].Value
    const phone = callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value

    console.log({id,phone,amount})

    const payment = new mpesaPayments()

    payment.number = phone
    payment.amount = amount
    payment.id = id

    payment.save()
    .then((data) => {
        console.log({message : "-----TRANSACTION SAVED SUCCESSFULLY-----", data})
    })
    .catch((err) => {
        console.log(err.message)
    })

})

module.exports = router