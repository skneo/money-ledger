const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const CustomerSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
    softDelete: {
        type: Boolean,
        default: false
    }

});
module.exports = mongoose.model('Customer', CustomerSchema);