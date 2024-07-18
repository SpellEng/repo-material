const mongoose = require('mongoose');

const scheduledClassesSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String,
    },
    recording: {
        type: Object,
    },
    meeetingTime: {
        type: String,
    },
    joinId: {
        type: String,
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const ScheduledClass = mongoose.model('ScheduledClass', scheduledClassesSchema);
module.exports = ScheduledClass;
