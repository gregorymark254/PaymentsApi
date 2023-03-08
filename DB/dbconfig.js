const mongoose = require("mongoose")
mongoose.set('strictQuery', false);

//connecting to mongoDB
const mongoconnect = async () => {
    try {
        mongoose.connect(process.env.DATABASE_ACCESS,{
            useUnifiedTopology: true,
            useNewUrlParser : true,
        })
        try {
            console.log("MongoDB Connected")
        } catch (error) {
            console.log(error)
            console.log("Could not connect to mongoDB")
        }
    } catch (error) {
        console.log(error)
        console.log("Mongo Database Error!!")
    }
}

module.exports = mongoconnect