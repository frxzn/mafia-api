const mongoose = require('mongoose')
const { Role, roleSchema } = require('./role')

const messageSchema = new mongoose.Schema({
    senderName: String,
    message: String,
    timestamp: Date
})

const partySchema = new mongoose.Schema({
    roomTitle: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "waiting"
    },
    numberOfPlayers: {
        type: Number,
        required: true
    },
    liveCivilians: {
        type: Number,
        required: true
    },
    liveMafias: {
        type: Number,
        required: true
    },
    instance: {
        type: String,
        default: "night",
    },
    changingRound: {
        type: Boolean,
        default: false
    },
    availableRoles: {
        type: [String],
        required: true
    },
    createdBy: {    
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    roles: [roleSchema],
    usersId: [mongoose.Schema.Types.ObjectId],
    playersId: [mongoose.Schema.Types.ObjectId],
    won: String,
    chat: [messageSchema],
    round: {
        type: Number,
        default: 1
    },
    roundDuration: {
        type: Number,
        default: null
    },
    endRoundDate: {
        type: Number,
        default: null
    },
})

partySchema.pre('save', async function() {
    this.roles = await Role.find().where('role').in(this.availableRoles).exec();
})

const Party = mongoose.model('Party', partySchema)

module.exports = { Party }