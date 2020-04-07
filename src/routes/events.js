const express = require('express')
const { Event } = require('../models/event')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/:partyId', auth, async (req, res) => {
    try {
        const event = await Event.create({
            ...req.body,
            partyId: req.params.partyId
        })
        res.status(201).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router