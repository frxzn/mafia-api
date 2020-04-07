const { Party } = require('../models/party')
const { Player } = require('../models/player')
const { roundLogic } = require('./roundLogic')
const { globalAnnouncement, toggleParty } = require('./utils')


const roundHandler = async (partyId) => {

    const party = await Party.findById(partyId)
    const players = await Player.find({partyId, alive: true, isDone: true})
    const alive = party.liveCivilians + party.liveMafias

    // all alive players are ready to continue:
    if (players.length === alive) {
        // ------------------Aqui poner en pausa la partida y enviar un evento para actualizar el estado despues de hacerlo---------------
        await Party.findByIdAndUpdate(partyId, {changingRound: true})
        // ------------------------------------------------------------------
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
            // ------------update state -------------------
            toggleParty(partyId, 'finished')
            await Party.findByIdAndUpdate(partyId, {won: 'mafias'})
            return globalAnnouncement(partyId, 'Todos los civiles fueron eliminados. Ganaron los Mafias!')
        }
        if (updatedParty.liveMafias === 0) {
            // ------------update state -------------------
            toggleParty(partyId, 'finished')
            await Party.findByIdAndUpdate(partyId, {won: 'civilians'})
            return globalAnnouncement(partyId, 'Todos los mafias fueron eliminados. Ganaron los Civiles!')
        }
        
        const newInstance = updatedParty.instance === 'night' ? 'day' : 'night'
        const newInstanceDisplay = updatedParty.instance === 'night' ? 'Dia' : 'Noche'

        // Announce new instance
        globalAnnouncement(partyId, `Se hizo de ${newInstanceDisplay}`)
        // Update new instance        // finish changing round
        await Party.findByIdAndUpdate(partyId, {changingRound: false, instance: newInstance})
    }
}

module.exports = {
    roundHandler
}