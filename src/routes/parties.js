const express = require('express')
const { Party } = require('../models/party')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const party = await Party.create({...req.body, createdBy: req.user._id})
        res.status(201).send({ party })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router