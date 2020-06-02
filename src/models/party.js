const mongoose = require('mongoose')
const { Role, roleSchema } = require('./role')

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
    round: {
        type: Number,
        default: 1
    },
    roundDuration: {
        type: Number,
        default: 0.5
    },
    endRoundDate: {
        type: Number,
        default: null
    },
    didMafiaShoot: {
        type: Boolean,
        default: false
    }
})

partySchema.pre('save', async function() {
    const roles = []
    for (let i = 0; i < this.availableRoles.length; i++) {
        const role = this.availableRoles[i];
        const res = await Role.find().where('role', role)
        roles.push(res[0])
    }
    this.roles = roles
})

const Party = mongoose.model('Party', partySchema)

module.exports = { Party }