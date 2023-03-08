const mongoose = require("mongoose")

const MpesaSchema = new mongoose.Schema(
    {
        number : { type: String, required: true},
        id : { type: String, required: true},
        amount : { type: String, required: true}
    },
    { timestamps : true }
)

module.exports = mongoose.model("MpesaPayments", MpesaSchema)