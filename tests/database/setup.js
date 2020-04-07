const { User } = require('../../src/models/user')
const { Party } = require('../../src/models/party')
const { Player } = require('../../src/models/player')
const { Event } = require('../../src/models/event')
const { userOne, userTwo, userThree } = require('./users')
const { initParty, playParty } = require('./parties')
const { playerOne, playerTwo, playerThree } = require('./players')

const setupInitPartyDb = async () => {
    // Whipe before start
    await User.deleteMany()
    await Party.deleteMany()
    await Player.deleteMany()
    // Create Users
    await User.create([userOne, userTwo, userThree])
    // Create Party
    await Party.create(initParty)
}

const setupPlayPartyDb = async () => {
    // Whipe before start
    await User.deleteMany()
    await Party.deleteMany()
    await Player.deleteMany()
    await Event.deleteMany()
    // Create Users
    await User.create([userOne, userTwo, userThree])
    // Create Party
    await Party.create(playParty)
    // Create Players
    await Player.create([playerOne, playerTwo, playerThree])
}

module.exports = {
    setupInitPartyDb,
    setupPlayPartyDb
}