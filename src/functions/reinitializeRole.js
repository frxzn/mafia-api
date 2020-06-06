const { Player } = require('../models/player')

const reinitializeDayRole = async (playerId) => {
    await Player.findByIdAndUpdate(playerId, {$set: {'skills.vote': false, isDone: false, numberOfVotes: 0}})
}

const reinitObject = {
    wasShot: false,
    wasHealed: false,
    wasArmCutOff: false,
    wasTongueCutOff: false,
    isDone: false
}

const reinitializeNightRole = async (playerId, role) => {

    switch (role) {
        case 'cop':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.investigate': false, ...reinitObject}
            })
            break;

        case 'medic':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.heal': false, ...reinitObject}
            })
            break;

        case 'butcher':
            await Player.findByIdAndUpdate(playerId, {
                $set: {...reinitObject}
            })
            break;

        case 'vagabond':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.beg': false, ...reinitObject}
            })
            break;

        case 'leaderMafia':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.shoot': false, ...reinitObject}
            })
            break;

        case 'assassinMafia':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.shoot': false, ...reinitObject}
            })
            break;

        case 'thiefMafia':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.shoot': false, ...reinitObject}
            })
            break;

        case 'apprenticeMafia':
            await Player.findByIdAndUpdate(playerId, {
                $set: {'skills.shoot': false, ...reinitObject}
            })
            break;

        default:
            break;
    }
}

module.exports = {
    reinitializeDayRole,
    reinitializeNightRole
}