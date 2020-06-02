const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderId: mongoose.Schema.Types.ObjectId,
    content: String,
    time: Number
})

const chatSchema = new mongoose.Schema({
    globalChat: [messageSchema],
    mafiaChat: [messageSchema],
    partyId: mongoose.Schema.Types.ObjectId,
})

const Chat = mongoose.model('Chat', chatSchema)
const Message = mongoose.model('Message', messageSchema)

module.exports = { Chat, Message }