const mongoose = require('mongoose')
const { cop, medic, leaderMafia} = require('./roles')
const { userOne, userTwo, userThree } = require('./users')
const { playParty } = require('./parties')

const playerOneId = new mongoose.Types.ObjectId()
const playerOne = {
    ...cop,
    _id: playerOneId,
    alive: true,
    isDone: false,
    numberOfVotes: 0,
    wasArmCutOff: false,
    wasHealed: false,
    wasInvestigated: false,
    wasShot: false,
    wasTongueCutOff: false,
    playerName: userOne.name,
    userId: userOne._id,
    partyId: playParty._id
}

const playerTwoId = new mongoose.Types.ObjectId()
const playerTwo = {
    ...medic,
    _id: playerTwoId,
    alive: true,
    isDone: false,
    numberOfVotes: 0,
    wasArmCutOff: false,
    wasHealed: false,
    wasInvestigated: false,
    wasShot: false,
    wasTongueCutOff: false,
    playerName: userTwo.name,
    userId: userTwo._id,
    partyId: playParty._id
}

const playerThreeId = new mongoose.Types.ObjectId()
const playerThree = {
    ...leaderMafia,
    _id: playerThreeId,
    alive: true,
    isDone: false,
    numberOfVotes: 0,
    wasArmCutOff: false,
    wasHealed: false,
    wasInvestigated: false,
    wasShot: false,
    wasTongueCutOff: false,
    playerName: userThree.name,
    userId: userThree._id,
    partyId: playParty._id
}

module.exports = {
    playerOne,
    playerTwo,
    playerThree
}