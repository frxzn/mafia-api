const { Player } = require('../models/player')

const reinitializeDayRole = async (playerId) => {
    await Player.findByIdAndUpdate(playerId, {$set: {'skills.vote': false, isDone: false, numberOfVotes: 0}})
}

const reinitializeNightRole = async (playerId, role, wasHealed) => {

    if ( wasHealed) {
        await Player.findByIdAndUpdate(playerId,{
            $set: {isDone: false, wasShot: false, wasHealed: false, wasArmCutOff: false, wasTongueCutOff: false}
        })
    } else if (!wasHealed) {
        await Player.findByIdAndUpdate(playerId,{
            $set: {isDone: false}
        })
    }

    switch (role) {
        case 'cop':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.investigate': false},
            }) 
            break;
        
        case 'medic':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.heal': false},
            }) 
            break;

        case 'vagabond':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.beg': false},
            }) 
            break;

        case 'leaderMafia':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.shoot': false},
            }) 
            break;

        case 'assassinMafia':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.shoot': false},
            }) 
            break;

        case 'thiefMafia':
            await Player.findByIdAndUpdate(playerId,{
                $set: {'skills.shoot': false},
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