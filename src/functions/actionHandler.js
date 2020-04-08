const { Player } = require('../models/player')
const { roundHandler } = require('./roundHandler')
const { sendUpdatedPlayers } = require('./utils')

const actionHandler = async ({partyId, playerId, targetId, action}) => {
    
    const player = await Player.findById(playerId)
    const target = await Player.findById(targetId)

    if (!player.isDone) {
        switch (action) {

            case 'investigate':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.investigate': true, isDone: true},
                    $push: {log: `${target.playerName} esta aliado con los ${target.sided}.`}
                })
                break;

            case 'heal':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasHealed: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.heal': true, isDone: true},
                    $push: {log: `Has curado a ${target.playerName}.`}
                })
                break;

            case 'shoot':
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
                    $push: {log: `Le has disparado a ${target.playerName}.`}
                })
                break;

            case 'cutTongue':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasTongueCutOff: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.cutTongue': true, isDone: player.skills.get('cutArm')},
                    $push: {log: `Le has cortado la lengua a ${target.playerName}.`}
                })
                break;

            case 'cutArm':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasArmCutOff: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.cutArm': true, isDone: player.skills.get('cutTongue')},
                    $push: {log: `Le has cortado la mano a ${target.playerName}.`}
                })
                break;

            case 'beg': // Testear de aqui hacia abajo
                const beggingFrases = ['Unas moneditas pa la torre del reloj, loco ?', 'Un peso pal bondi?', 'Unos pesitos pal vino ?']
                const frase = beggingFrases[Math.floor(Math.random() * beggingFrases.length)];
    
                await Player.findByIdAndUpdate(targetId,{
                    $push: {log: `El mendigo dice: ${frase}`}
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.beg': true, isDone: true},
                    $push: {log: `Le has mendigado a ${target.playerName}.`}
                })
                break;

            case 'specialShot':
                await Player.findByIdAndUpdate(targetId,{
                    $set: { wasShot: true }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.specialShot': true, isDone: player.skills.get('shoot')},
                    $push: {log: `Le has disparado a ${target.playerName}.`}
                })
                break;

            case 'steal':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.steal': true, isDone: player.skills.get('shoot')},
                    $push: {log: `El rol de ${target.playerName} es ${target.display}.`}
                })
                break;

            case 'vote':
                await Player.findByIdAndUpdate(targetId,{
                    $inc: { numberOfVotes: 1 }
                })

                await Player.findByIdAndUpdate(playerId,{
                    $set: {'skills.vote': true, isDone: true},
                    $push: {log: `Has votado a ${target.playerName}.`}
                })
                break;

            case 'ready':
                await Player.findByIdAndUpdate(playerId,{
                    $set: {isDone: true},
                    $push: {log: 'Te fuiste a dormir...'}
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