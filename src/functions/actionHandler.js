const { Player } = require('../models/player')
const { Party } = require('../models/party')
const { roundHandler } = require('./roundHandler')
const { sendUpdatedPlayers, updateParty, privateLog, globalAnnouncement } = require('./utils')

const actionHandler = async ({partyId, playerId, targetId, action}) => {
    
    const player = await Player.findById(playerId)
    const target = await Player.findById(targetId)

    if (!player.isDone && !player[action]) {
        switch (action) {

            case 'investigate':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.investigate': true, isDone: true},
                    $push: {log: privateLog(`"${target.playerName}" is sided with the ${target.sided}.`)}
                })
                break;

            case 'heal':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasHealed: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.heal': true, isDone: true},
                    $push: {log: privateLog(`You have healed "${target.playerName}".`)}
                })
                break;

            case 'shoot':
                const party = await Party.findById(partyId)
                if (!party.didMafiaShoot) {
                    
                    await updateParty(partyId, {didMafiaShoot: true})
                    let isDone = true

                    if (player.role === 'assassinMafia') {
                        isDone = player.skills.get('specialShot')
                    } else if (player.role === 'thiefMafia') {
                        isDone = player.skills.get('steal')
                    }

                    await Player.findByIdAndUpdate(targetId,{
                        $set: { wasShot: true }
                    })

                    await Player.findByIdAndUpdate(playerId,{
                        $set: {'skills.shoot': true, isDone},
                        $push: {log: privateLog(`You shot "${target.playerName}".`)}
                    })
                }
                break;

            case 'cutTongue':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasTongueCutOff: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.cutTongue': true, isDone: player.skills.get('cutArm')},
                    $push: {log: privateLog(`You have cut off "${target.playerName}'s" tongue.`)}
                })
                break;

            case 'cutArm':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasArmCutOff: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.cutArm': true, isDone: player.skills.get('cutTongue')},
                    $push: {log: privateLog(`You have cut off "${target.playerName}'s" hand.`)}
                })
                break;

            case 'beg':
                const beggingFrases = ['Unas moneditas pa la torre del reloj, loco ?', 'Un peso pal bondi?', 'Unos pesitos pal vino ?']
                const frase = beggingFrases[Math.floor(Math.random() * beggingFrases.length)];

                await Player.findByIdAndUpdate(targetId,{
                    $push: {log: privateLog(`The Vagabond says: "${frase}"`)}
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.beg': true, isDone: true},
                    $push: {log: privateLog(`You have begged for some money to "${target.playerName}".`)}
                })
                break;

            case 'specialShot':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasShot: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.specialShot': true, isDone: player.skills.get('shoot')},
                    $push: {log: privateLog(`You shot "${target.playerName}".`)}
                })
                break;

            case 'steal':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.steal': true, isDone: player.skills.get('shoot')},
                    $push: {log: privateLog(`"${target.playerName}'s" role is ${target.display}.`)}
                })
                break;

            case 'vote':
                await Player.findByIdAndUpdate(targetId,{
                    $inc: { numberOfVotes: 1 }
                })
                // isDone is hard-coded to true, since during daytime 'vote' is the only skill all players have
                // hence they'll be done. If new day skills are added, would need to check first.
                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.vote': true, isDone: true},
                    $push: {log: privateLog(`You voted for "${target.playerName}".`)}
                })

                await globalAnnouncement(partyId, `"${player.playerName}" has voted for "${target.playerName}" to be lynched.`)
                break;

            case 'ready':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {isDone: true},
                    $push: {log: privateLog('You went to sleep.')}
                })
                break;

            default:
                break;
        }
        // Aqui actualizar estado
        // cada vez que alguien realiza una accion, actualizar todos los jugadores
        await sendUpdatedPlayers(partyId)
        // Aqui afuera procesar eventos
        await roundHandler(partyId)
    }
}

module.exports = {
    actionHandler
}