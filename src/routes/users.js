const express = require('express')
const { User } = require('../models/user')
// const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router