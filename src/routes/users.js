const express = require('express')
const { User } = require('../models/user')
const auth = require('../middleware/auth')

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

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({error: 'Invalid Credentials'})
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router