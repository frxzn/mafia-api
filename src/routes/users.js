const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { User } = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

//Check if User is authenticated
router.get('/me', auth, (req, res) => {
    res.send(req.user)
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create({...req.body})
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({error: e.message})
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

// User Avatar Image
const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image'))
        }
        cb(undefined, true)
    }
})

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 256, height: 256}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error()
        }
        if (!user.avatar) {
            const avatarBuffer = fs.readFileSync(path.join(__dirname, '../avatar.png'))
            const avatar = Buffer.from(avatarBuffer, 'base64');
            res.set('Content-type', 'image/png')
            res.send(avatar)
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router