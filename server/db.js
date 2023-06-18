const mongoose = require('mongoose')
// const mongoURI = 'mongodb://0.0.0.0:27017/ledger'
//mongodb atlas URI
const mongoURI = process.env.MONGODB_URL
const connetToMongo = () => {
    mongoose.connect(mongoURI)
        .then(console.log("connected to mongodb successfully on satish pc"))
}
module.exports = connetToMongo;