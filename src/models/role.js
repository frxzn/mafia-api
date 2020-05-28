const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    global: Boolean,
    event: String,
})

const roleSchemaProps = {
    role: String,
    skills: {
        type: Map,
        of: Boolean
    },
    displaySkills: {
        day: [String],
        night: [String]
    },
    log: [logSchema],
    description: String,
    display: String,
    sided: String
}

const roleSchema = new mongoose.Schema(roleSchemaProps, { versionKey: false })

const Role = mongoose.model('Role', roleSchema)

module.exports = {
    Role,
    roleSchema,
    roleSchemaProps
}