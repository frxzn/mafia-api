const { Player } = require('../models/player')
const { Party } = require('../models/party')

const globalAnnouncement = async (partyId, message) => {
    await Player.updateMany({partyId}, {
        $push: {log: message}
    })
}

const killPlayer = async (playerId, partyId, sided) => {
    await Player.findByIdAndUpdate(playerId,{
        $set: {alive: false}
    })
    if (sided === 'civilians'){
        await Party.findByIdAndUpdate(partyId,{
            $inc: { liveCivilians: -1 }
        })
    } else if (sided === 'mafia') {
        await Party.findByIdAndUpdate(partyId,{
            $inc: { liveMafias: -1 }
        })
    }
}

const toggleParty = async (partyId, status) => {
    await Party.findByIdAndUpdate(partyId, {status})
}

module.exports = {
    globalAnnouncement,
    killPlayer,
    toggleParty
}