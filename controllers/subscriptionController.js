const Subscription = require('../models/subscriptionModel');
const Template = require('../templates/email-template');
const sendEmail = require('../nodemailer');
const razorpay = require('../utils/razorpay');

exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ createdAt: -1 });
        if (subscriptions) {
            res.status(200).json(subscriptions);
        } else {
            res.status(404).json({ errorMessage: 'No subscriptions Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getAllUserSubscriptionsById = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.params.id });
        if (subscriptions) {
            res.status(200).json(subscriptions);
        } else {
            res.status(404).json({ errorMessage: 'No subscriptions Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getActiveSubscriptionStatusByUser = async (req, res) => {
    try {
        const subscriptions = await Subscription.findOne({ user: req.user?._id, status: "active" });
        if (subscriptions) {
            res.status(200).json(subscriptions);
        } else {
            res.status(404).json({ errorMessage: 'No subscriptions Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ _id: req.params.id });
        if (subscription) {
            res.status(200).json(subscription);
        } else {
            res.status(404).json({ errorMessage: 'No subscription found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}



exports.createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}

exports.createSubscription = async (req, res) => {
    const { plan, razorpayPaymentId, amount, classesPerMonth, email, name } = req.body;

    let durationInMonths;
    if (plan === '1 Month Plan') {
        durationInMonths = 1;
    } else if (plan === '3 Month Plan') {
        durationInMonths = 3;
    } else {
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    try {
        // Verify the payment with Razorpay
        const payment = await razorpay.payments.fetch(razorpayPaymentId);

        if (payment.status !== 'captured') {
            return res.status(400).json({ error: 'Payment not successful' });
        }

        // Calculate the expiry date based on the plan duration
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);

        // Create a new subscription in the database
        const newSubscription = new Subscription({
            razorpayPaymentId: razorpayPaymentId,
            user: req.user?._id,
            plan,
            status: 'active',
            classesPerMonth,
            amount,
            expiryDate
        });

        await newSubscription.save();

        // Send an email notification
        sendEmail(email, "Your subscription is activated!", Template({ subscriptionId: razorpayPaymentId, name }));

        res.json({ successMessage: 'Subscription created and activated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
}


exports.updateSubscriptionStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            { _id: id },
            { status: req.body.status },
            { new: true }
        );

        if (subscription) {
            res.status(200).json(subscription);
        } else {
            res.status(404).json({ error: 'Subscription not found' });
        }
    } catch (error) {
        console.error('Error updating subscription status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ _id: req.params.id }).exec();
        if (subscription) {
            subscription.status = "0";
            subscription.save(async (err, result) => {
                if (result) {
                    await sendEmail(result.user.email, "Your is cancelled", Template({ subscriptionId: result._id, name: result.user.name, subscriptionStatus: "Cancelled" }))
                    res.status(200).json({ successMessage: 'Subscription Cancelled Successfully' });
                } else {
                    console.log('Failed subscription cancellation');
                }
            })
        } else {
            res.status(404).json({ errorMessage: 'No subscription found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
