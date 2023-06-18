const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer')
const Transaction = require('../models/Transaction')
const fetchuser = require('../middleware/fetchuser')

router.get('/all-customers', fetchuser, async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.id, softDelete: false }).select("-userId -softDelete -__v");
        res.send({ customers })
    } catch (error) {
        res.status(500).send({ error: "Internal server error" })
    }
})

router.post('/add-customer', fetchuser, async (req, res) => {
    try {
        let customer = await Customer.findOne({ name: req.body.name, userId: req.user.id });
        if (customer) {
            return res.status(400).send({ "message": 'Request failed! ' + req.body.name + " already present" })
        }
        customer = await Customer.create({
            name: req.body.name,
            balance: 0,
            userId: req.user.id
        })
        return res.send({ customer, 'message': `${req.body.name} added` })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

router.delete('/delete-customer', fetchuser, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.body.customerId, userId: req.user.id });
        customer.softDelete = true;
        customer.save()
        res.json({ message: `${customer.name} moved to trash successfully`, trashed: true });
    } catch {
        res.status(500).json({ message: "Some error occurred" })
    }
})

router.get('/transactions/:customerId', fetchuser, async (req, res) => {
    try {
        let customerId = req.params.customerId;
        let customer = await Customer.findById({ userId: req.user.id, _id: customerId })
        const transactions = await Transaction.find({ userId: req.user.id, customerId }).select("amount balance date remark");
        res.send({ transactions, 'name': customer.name, 'balance': customer.balance })
    } catch (error) {
        // console.error(error)
        res.status(500).send({ "message": "Internal server error" })
    }
})

router.post('/add-transaction', fetchuser, async (req, res) => {
    try {
        let newAmount = parseInt(req.body.amount)
        const customer = await Customer.findOne({ _id: req.body.customerId, userId: req.user.id });
        if (req.body.money === 'gave') {
            newAmount = -newAmount
        }
        const transaction = await Transaction.create({
            userId: req.user.id,
            customerId: req.body.customerId,
            amount: newAmount,
            date: req.body.date,
            balance: customer.balance + newAmount,
            remark: req.body.remark
        })
        customer.balance = transaction.balance
        customer.save()
        res.send({ 'message': newAmount < 0 ? `Saved! You gave ${req.body.amount} Rs` : `Saved! You got ${req.body.amount} Rs`, transaction })
    } catch (error) {
        console.log(error)
        res.status(500).send({ "message": "Some error occurred" })
    }
})
router.get('/trash', fetchuser, async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.id, softDelete: true }).select("-userId -softDelete -__v");
        res.send({ customers })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})
router.put('/restore', fetchuser, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.body.customerId, userId: req.user.id });
        customer.softDelete = false;
        customer.save()
        res.json({ message: `${customer.name} restored successfully`, trashed: false });
    } catch {
        res.status(500).json({ message: "Some error occurred" })
    }
})
module.exports = router