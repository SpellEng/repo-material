const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpaySubscriptionId: {
        type: Object,
    },
    plan: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    classesPerMonth: {
        type: String,
        default: ''
    },
    expiryDate: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, { timestamps: true }
);

const subscriptionModel = new mongoose.model('Subscription', subscriptionSchema);
module.exports = subscriptionModel;
