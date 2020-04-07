const express = require('express')
const { Player } = require('../models/player')
const { Party } = require('../models/party')
const auth = require('../middleware/auth')
const join = require('../middleware/join')

const router = express.Router()

router.post('/:partyId', auth, join, async (req, res) => {
    try {
        const player = await Player.create({
            ...req.role,
            playerName: req.user.name,
            userId: req.user._id,
            partyId: req.params.partyId
        })
        await Party.findByIdAndUpdate(req.params.partyId,
            {
                $push: {playersId: player._id}
            }
        )
        res.status(201).send(player)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router