const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String
    }
});

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: 0
    },
    picture: {
        type: Object,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: String
    },
    verification: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    proficiency: {
        type: String,
    },
    learningGoals: {
        type: Array,
    },
    headline: {
        type: String,
    },
    experience: {
        type: String,
    },
    education: {
        type: String,
    },
    specialities: {
        type: Array,
    },
    languages: {
        type: Array,
    },
    description: {
        type: String,
    },
    videoLink: {
        type: String,
    },
    lastMessage: {
        type: Object
    },
    trialActivated: {
        type: Boolean
    },
    trialUsed: {
        type: Boolean
    },
    trialDetails: {
        type: Object,
    },
    availability: [availabilitySchema], // Integrate the availability schema
    status: {
        type: String,
        default: 'active'
    },
    timezone: {
        type: String,
    },
    reviews: [{
        rating: { type: Number, required: true },
        message: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledClass' }
    }],
    paymentDetails: [{
        type: { type: String, required: true }, // 'bank' or 'upi'
        accountHolderName: String, // required if type is 'bank'
        accountNumber: String, // required if type is 'bank'
        ifscCode: String, // required if type is 'bank'
        upiId: String, // required if type is 'upi'
        isPreferred: { type: Boolean, default: false }
    }],
    withdrawals: [{
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: String, required: true },
    }],
    subscriptionsHistory: {
        type: Array
    },
    recording: {
        type: String
    },

}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
