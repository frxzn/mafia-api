const { Party } = require('../models/party')
const { Player } = require('../models/player')
const { roundLogic } = require('./roundLogic')
const { globalAnnouncement, sendUpdatedPlayers, updateParty } = require('./utils')
const timeout = require('./timeout')

const roundHandler = async (partyId) => {

    const party = await Party.findById(partyId)
    const players = await Player.find({partyId, alive: true, isDone: true})
    const alivePlayers = party.liveCivilians + party.liveMafias

    // all alive players are ready to continue:
    if (players.length === alivePlayers) {
        // Update Sockets
        await updateParty(partyId, {changingRound: true})

        let lynchedPlayerId = null
        if (party.instance === 'day') {
            // lynch ?
            const playerMostVotes = await Player.find({partyId, alive: true, isDone: true}).sort({numberOfVotes:-1}).limit(1)
            const topVotes = playerMostVotes[0].numberOfVotes
            const playersTopVotes = players.filter(player => player.numberOfVotes === topVotes)
            if (playersTopVotes.length === 1) {
                lynchedPlayerId = playersTopVotes[0]._id
            }
        }
        for (let i = 0; i < players.length; i++) {
            const playerId = players[i]._id
            await roundLogic(playerId, partyId, lynchedPlayerId)
        }
        // Check if game is finished
        const updatedParty = await Party.findById(partyId)

        if (updatedParty.liveCivilians === 0) {
            // Update Sockets
            await globalAnnouncement(partyId, 'Todos los civiles fueron eliminados. Ganaron los Mafias!')
            await sendUpdatedPlayers(partyId)
            return await updateParty(partyId, {won: 'mafia', status: 'finished', endgame: Date.now()})
            
        }
        if (updatedParty.liveMafias === 0) {
            // Update Sockets
            await globalAnnouncement(partyId, 'Todos los mafias fueron eliminados. Ganaron los Civiles!')
            await sendUpdatedPlayers(partyId)
            return await updateParty(partyId, {won: 'civilians', status: 'finished', endgame: Date.now()})
            
        }
        if (updatedParty.round > 40) {
            // Update Sockets
            await globalAnnouncement(partyId, 'Game Ended. No one won.')
            await sendUpdatedPlayers(partyId)
            return await updateParty(partyId, {won: 'tie', status: 'finished', endgame: Date.now()})
            
        }
        
        const newInstance = updatedParty.instance === 'night' ? 'day' : 'night'
        const newInstanceDisplay = updatedParty.instance === 'night' ? 'Dia' : 'Noche'

        // Update Sockets
        await globalAnnouncement(partyId, `Se hizo de ${newInstanceDisplay}`)
        await sendUpdatedPlayers(partyId)
        const roundDurationMS = updatedParty.roundDuration * 60 * 1000 // roundDuration: minutes to miliseconds
        await updateParty(partyId,
            {$set: {
                changingRound: false,
                instance: newInstance,
                didMafiaShoot: false,
                endRoundDate: Date.now() + roundDurationMS
            },
            $inc: {round: 1}})

        const prevRound = updatedParty.round + 2
        timeout.startTimeout(partyId, prevRound, roundDurationMS)
    }
}

module.exports = {
    roundHandler
}