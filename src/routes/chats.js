const express = require('express')
const { Chat, Message } = require('../models/chat')
const auth = require('../middleware/auth')

const router = express.Router()

// Load Chat Messages
router.get('/:partyId', auth, async (req, res) => {
    const partyId = req.params.partyId
    try {
        const chat = await Chat.findOne({partyId})
        res.send(chat)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Post Message to Global or Mafia Chat "globalChat / mafiaChat"
router.post('/:partyId/:chat', auth, async (req, res) => {
    const partyId = req.params.partyId
    const chat = req.params.chat
    const message = new Message(req.body)
    try {
        await Chat.findOneAndUpdate({partyId}, {
            $addToSet: {[chat]: message}
        })
        res.send(message)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router