const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            receiver: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
            file: {
                type: Object
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true }
);

const chatModal = new mongoose.model('chat', chatSchema);
module.exports = chatModal;
