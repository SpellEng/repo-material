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
        default: []
    }],
    cancelledBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
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
    ended: {
        type: Boolean,
        default: false
    },
    joinId: {
        type: String,
    },
    meetingUrl: {
        type: String,
    },
    trialClass: {
        type: Boolean,
        default: false
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
    ],
    review: {
        rating: { type: Number },
        message: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
}, { timestamps: true });

const ScheduledClass = mongoose.model('ScheduledClass', scheduledClassesSchema);
module.exports = ScheduledClass;
