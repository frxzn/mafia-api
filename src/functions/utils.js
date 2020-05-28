const { Player } = require('../models/player')
const { Party } = require('../models/party')

const privateLog = (event) => {
    return {
        global: false,
        event
    }
}

const publicLog = (event) => {
    return {
        global: true,
        event
    }
}

const globalAnnouncement = async (partyId, message) => {
    await Player.updateMany({partyId}, {
        $push: {log: publicLog(message)}
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

const updateParty = async (partyId, update) => {
    await Party.findByIdAndUpdate(partyId, update, {new: true}, (err, res) => {
        if (err) {
            console.log(err)
        }
        const { _doc } = res
        const { chat, ...rest } = _doc
        require('../http').io.to(partyId).emit('updateParty', rest)
    })
}

const sendUpdatedPlayers = async (partyId) => {
    await Player.find({partyId}, (err, res) => {
        if (err) {
            console.log(err)
        }
        require('../http').io.to(partyId).emit('updatePlayers', res)
    })
}

module.exports = {
    globalAnnouncement,
    killPlayer,
    updateParty,
    sendUpdatedPlayers,
    privateLog,
    publicLog,
}