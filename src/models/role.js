const mongoose = require('mongoose')

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
    log: [String],
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