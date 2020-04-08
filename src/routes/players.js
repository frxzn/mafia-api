const express = require('express')
const { Player } = require('../models/player')
const { Party } = require('../models/party')
const auth = require('../middleware/auth')
const join = require('../middleware/join')
const { sendUpdatedPlayers, updateParty } = require('../functions/utils')

const router = express.Router()

router.post('/:partyId', auth, join, async (req, res) => {
    try {
        const player = await Player.create({
            ...req.role,
            playerName: req.user.name,
            userId: req.user._id,
            partyId: req.params.partyId
        })
        await sendUpdatedPlayers(req.params.partyId)
        await Party.findByIdAndUpdate(req.params.partyId,
            {
                $addToSet: {playersId: player._id, usersId: req.user._id}
                
            },
            {new: true}, async (err, res) => {
                if (err) {
                    console.log(err)
                }
                if (res.playersId.length == res.numberOfPlayers) {
                    await updateParty(req.params.partyId, {status: 'playing'})
                }
            }
        )
        res.status(201).send(player)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router