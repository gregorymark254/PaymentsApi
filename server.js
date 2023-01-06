require("dotenv").config()
const express = require("express")
const app = express()
const request = require("request")
const cors = require("cors")
const axios = require("axios")
const paypal = require("paypal-rest-sdk")
const mpesa = require("./routes/Mpesa")
var mongoose = require("mongoose");

//routes
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html")
})
app.use("/api/v1", mpesa) //mpesa payment route


mongoose.set('strictQuery', false);
var db = "mongodb+srv://hotel:mypassword@cluster0.lmfacxi.mongodb.net/USERS?retryWrites=true&w=majority";
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

const conSuccess = mongoose.connection
conSuccess.once('open', _ => {
  console.log('Database connected:', db)
})

conSuccess.on('error', err => {
  console.error('connection error:', err)
})


//server connection
const PORT = process.env.PORT
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))


// // Handled Promise Rejection
// process.on("unhandledRejection", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log(`Shutting down the server due to Unhandled Promise Rejection`);

//     server.close(() => {
//         process.exit(1);
//     });
// });