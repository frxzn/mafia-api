const { Party } = require('../models/party')
const { Player } = require('../models/player')
const { Event } = require('../models/event')

const handleRoundEnd = async (partyId, prevRound) => {
    const party = await Party.findById(partyId)
    const currentRound = party.round

    // If we are on the same round
    if (prevRound === currentRound && party.instance === 'playing') {
        // Find All players that are not ready
        await Player.find({partyId, isDone: false}, async (err, res) => {
            if (err) {
                console.log(err)
            }
            // Create Events for each
            for (let i = 0; i < res.length; i++) {
                const player = res[i]
                await Event.create({
                    playerId: player._id,
                    targetId: player._id,
                    partyId,
                    action: 'ready'
                }) 
            }
        })
    }
}

module.exports.handleRoundEnd = handleRoundEnd