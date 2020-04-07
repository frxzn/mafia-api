const mongoose = require('mongoose')
const { actionHandler } = require('../functions/actionHandler')

const eventSchema = new mongoose.Schema({
    playerId: mongoose.Schema.Types.ObjectId,
    targetId: mongoose.Schema.Types.ObjectId,
    partyId: mongoose.Schema.Types.ObjectId,
    action: String,
})

eventSchema.pre('save', async function() {
    await actionHandler(this)
})

const Event = mongoose.model('Event', eventSchema)

module.exports = { Event }