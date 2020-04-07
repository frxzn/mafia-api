const express = require('express')
const { Role } = require('../models/role')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({})
        res.send(roles)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/', async (req, res) => {
    const role = await Role.create(req.body)
    res.send(role)
})

module.exports = router