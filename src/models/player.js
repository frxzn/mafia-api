const mongoose = require('mongoose')
const { roleSchemaProps } = require('./role')

const playerSchema = new mongoose.Schema({
    alive: {
        type: Boolean,
        default: true
    },
    isDone: {
        type: Boolean,
        default: false
    },
    numberOfVotes: {
        type: Number,
        default: 0
    },
    wasArmCutOff: {
        type: Boolean,
        default: false
    },
    wasHealed: {
        type: Boolean,
        default: false
    },
    wasInvestigated: {
        type: Boolean,
        default: false
    },
    wasShot: {
        type: Boolean,
        default: false
    },
    wasTongueCutOff: {
        type: Boolean,
        default: false
    },
    playerName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    ...roleSchemaProps
})

const Player = mongoose.model('Player', playerSchema)

module.exports = { Player }