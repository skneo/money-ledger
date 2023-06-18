const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true
    },
    remark: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
});
module.exports = mongoose.model('Transaction', TransactionSchema);