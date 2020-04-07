const { Party } = require('../models/party')
const { toggleParty } = require('../functions/utils')

const join = async (req, res, next) => {
    try {
        const party = await Party.findById(req.params.partyId)
        if (party.status !== 'waiting') {
            throw new Error('Game has already started')
        }
        if (party.usersId.includes(req.user._id)) {
            throw new Error('You have already joined this room')
        }
        const doc = await Party.findByIdAndUpdate(req.params.partyId,
            {
                $pop: {roles: -1}
            }
        );
        const role = doc.roles[0]
        if (!role) {
            throw new Error('All spots taken')
        }
        const cleanRole = role.toObject()
        delete cleanRole._id
        req.role = cleanRole
        await Party.findByIdAndUpdate(req.params.partyId,
            {
                $push: {usersId: req.user._id}
            }
        )
        if (doc.roles.length === 1) {
            toggleParty(req.params.partyId, 'playing')
            // update state
        }
        next()
    } catch (e) {
        res.status(401).send({error: e.message})
    }
}

module.exports = join