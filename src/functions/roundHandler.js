const { Party } = require('../models/party')
const { Player } = require('../models/player')
const { roundLogic } = require('./roundLogic')
const { globalAnnouncement, sendUpdatedPlayers, updateParty } = require('./utils')


const roundHandler = async (partyId) => {

    const party = await Party.findById(partyId)
    const players = await Player.find({partyId, alive: true, isDone: true})
    const alive = party.liveCivilians + party.liveMafias

    // all alive players are ready to continue:
    if (players.length === alive) {
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
            return await updateParty(partyId, {won: 'mafias', status: 'finished'})
            
        }
        if (updatedParty.liveMafias === 0) {
            // Update Sockets
            await globalAnnouncement(partyId, 'Todos los mafias fueron eliminados. Ganaron los Civiles!')
            await sendUpdatedPlayers(partyId)
            return await updateParty(partyId, {won: 'civilians', status: 'finished'})
            
        }
        
        const newInstance = updatedParty.instance === 'night' ? 'day' : 'night'
        const newInstanceDisplay = updatedParty.instance === 'night' ? 'Dia' : 'Noche'

        // Update Sockets
        await globalAnnouncement(partyId, `Se hizo de ${newInstanceDisplay}`)
        await sendUpdatedPlayers(partyId)
        await updateParty(partyId, {$set: {changingRound: false, instance: newInstance}, $inc: {round: 1}})
        
        // Set timeout
        // call function that queries current round => if round === prev round
        // loop through all players to done
        // send updated players

    }
}

module.exports = {
    roundHandler
}