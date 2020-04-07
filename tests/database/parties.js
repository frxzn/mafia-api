const mongoose = require('mongoose')
const { userOneId } = require('./users')

const initPartyId = new mongoose.Types.ObjectId()
const initParty = {
    _id: initPartyId,
    roomTitle: 'Init Party Room Name',
    numberOfPlayers: 3,
    liveCivilians: 2,
    liveMafias: 1,
    availableRoles: ['cop', 'medic', 'leaderMafia'],
    createdBy: userOneId
}

const playPartyId = new mongoose.Types.ObjectId()
const playParty = {
    _id: playPartyId,
    status: 'playing',
    instance: 'night',
    changingRound: false,
    availableRoles: ['cop', 'medic', 'leaderMafia'],
    usersId: [],
    playersId: [],
    roomTitle: 'Play Party Room Name',
    numberOfPlayers: 3,
    liveCivilians: 2,
    liveMafias: 1,
    createdBy: userOneId
}

module.exports = {
    initParty,
    initPartyId,
    playParty,
    playPartyId,
}