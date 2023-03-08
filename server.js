require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const axios = require("axios")
const mpesa = require("./routes/Mpesa")
const paypal = require("./routes/Paypal")
const mongoconnect = require("./DB/dbconfig")


//Database Connection
mongoconnect()


//routes
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use("/api/v1", mpesa) //mpesa payment route
app.use("/api/v2", paypal) //paypal payment route


//Getting backend server
app.get('/', (req,res) => {
  res.send("Backend Server")
})


//server connection
const PORT = process.env.PORT
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))


