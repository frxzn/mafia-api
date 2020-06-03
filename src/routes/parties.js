const express = require('express')
const { Party } = require('../models/party')
const { Chat } = require('../models/chat')
const auth = require('../middleware/auth')

const router = express.Router()

const rolesMap = {
    cop: 'civilian',
    medic: 'civilian',
    butcher: 'civilian',
    vagabond: 'civilian',
    leaderMafia: 'mafia',
    assassinMafia: 'mafia',
    thiefMafia: 'mafia',
    apprenticeMafia: 'mafia'
}

router.post('/', auth, async (req, res) => {
    try {
        let liveCivilians = 0
        let liveMafias = 0
        let numberOfPlayers = req.body.availableRoles.length

        req.body.availableRoles.forEach(role => {
            if (rolesMap[role] === 'civilian') {
                liveCivilians ++
            } else if (rolesMap[role] === 'mafia') {
                liveMafias ++
            }
        })

        const party = await Party.create({...req.body, liveCivilians, liveMafias, numberOfPlayers ,createdBy: req.user._id})
        const partyId = party._id
        await Chat.create({partyId})
        res.status(201).send(party)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/',auth, async (req, res) => {
    try {
        const parties = await Party.find({ $and: [ {status: 'waiting'}, {$nor: [{usersId: req.user._id}]} ] })
        res.status(200).send(parties)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/me', auth, async (req, res) => {
    try {
        const parties = await Party.find( { $and: [{$nor: [{status: 'finished'}]}, {usersId: req.user._id} ] })
        res.status(200).send(parties)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:partyId', async (req, res) => {
    try {
        const party = await Party.findById(req.params.partyId)
        res.send(party)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router