const { Player } = require('../models/player')
const { Party } = require('../models/party')
const { globalAnnouncement, killPlayer } = require('./utils')
const { reinitializeDayRole, reinitializeNightRole } = require('./reinitializeRole')

const roundLogic = async (playerId, partyId, lynchedPlayerId) => {

    const player = await Player.findById(playerId)
    const party = await Party.findById(partyId)

    if (party.instance === 'night') {
        if (!player.wasHealed){
            if (!player.wasShot) {
                if (player.wasArmCutOff) {
                    // Player was not healed and arm was cut off
                    await globalAnnouncement(partyId, `Le han cortado el brazo a ${player.playerName}.`)
                }
                if (player.wasTongueCutOff) {
                    // Player was not healed and tongue was cut off
                    await globalAnnouncement(partyId, `Le han cortado la lengua a ${player.playerName}.`)
                }
                return await reinitializeNightRole(playerId, player.role, player.wasHealed)
            } else if (player.wasShot) {
                // Player was not healed and was shot = dies
                await killPlayer(playerId, partyId, player.sided)
                return await globalAnnouncement(partyId, `${player.playerName} ha muerto de un disparo!`)
            }
        } else if (player.wasHealed) {
            // Player was healed = cures everything
            return await reinitializeNightRole(playerId, player.role, player.wasHealed)          
        }
    } else if (party.instance === 'day') {
        if (lynchedPlayerId === playerId) {
            await killPlayer(playerId, partyId, player.sided)
            return await globalAnnouncement(partyId, `${player.playerName} ha sido linchado por el pueblo!`)
        }
        // There was no lynching or I was not the lynched player
        return await reinitializeDayRole(playerId)
    }
}

module.exports = {
    roundLogic
}