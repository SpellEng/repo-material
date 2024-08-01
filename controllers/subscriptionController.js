const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const sendEmail = require('../nodemailer');
const razorpay = require('../utils/razorpay');
const config = require('../config/keys');
const moment = require('moment');
const StudentBuySubscriptionTemplate = require('../templates/student-buy-subscription-template');
const AdminStudentBuySubscriptionTemplate = require('../templates/admin-student-buy-subscription-template');

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
        const subscriptions = await Subscription.find({ user: req.params.id }).sort({ createdAt: -1 });
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
        const subscriptions = await Subscription.findOne({ user: req.user?._id, status: "active" }).sort({ createdAt: -1 });
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
    if (amount) {
        const options = {
            amount: parseInt(amount) * 100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        try {
            const order = await razorpay.orders.create(options);
            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ errorMessage: `${error?.error?.description}. Failed to create order` });
        }
    } else {
        es.status(500).json({ errorMessage: 'Amount is required. Failed to create order' });
    }
}

exports.createSubscription = async (req, res) => {
    const { plan, razorpayPaymentId, amount, classesPerMonth, email, name } = req.body;

    let durationInMonths;
    if (plan === '1 Month') {
        durationInMonths = 1;
    } else if (plan === '3 Months') {
        durationInMonths = 3;
    } else {
        durationInMonths = 6;
    }

    let totalClasses = durationInMonths * parseInt(classesPerMonth);

    try {
        // Verify the payment with Razorpay
        const payment = await razorpay.payments.fetch(razorpayPaymentId);

        if (payment.status !== 'captured') {
            return res.status(400).json({ error: 'Payment not successful' });
        }

        // Calculate the expiry date based on the plan duration 
        const startDate = moment().format("DD/MM/YYYY");
        const expiryDate = moment().add(durationInMonths, 'months').format("DD/MM/YYYY");

        // Create a new subscription in the database
        const findSubscription = await Subscription.findOne({ user: req.user?._id });
        // const findUser = await User.findOne({ user: req.user?._id });
        if (findSubscription) {
            let newExpiryDateIsAfterPrevDate = moment(expiryDate, "DD/MM/YYYY").isAfter(moment(findSubscription.expiryDate, "DD/MM/YYYY"));
            let subscriptionObject = {
                razorpayPaymentId: findSubscription.razorpayPaymentId,
                user: req.user?._id,
                plan: findSubscription.plan,
                totalClasses: findSubscription.totalClasses,
                status: findSubscription.status,
                classesPerMonth: findSubscription.classesPerMonth,
                amount: findSubscription.amount,
                expiryDate: findSubscription.expiryDate,
                startDate: findSubscription.startDate
            }
            findSubscription.razorpayPaymentId = razorpayPaymentId;
            findSubscription.plan = plan;
            findSubscription.totalClasses = findSubscription.totalClasses + totalClasses;
            findSubscription.classesPerMonth = classesPerMonth;
            findSubscription.amount = amount;
            findSubscription.startDate = startDate;
            findSubscription.expiryDate = newExpiryDateIsAfterPrevDate ? expiryDate : findSubscription.expiryDate;
            findSubscription.status = "active";
            await findSubscription.save();

            await User.findByIdAndUpdate(
                { _id: req.user?._id },
                { $push: { subscriptionsHistory: subscriptionObject } },
                { new: true }
            )
            // Send an email notification
            sendEmail(email, "Subscription Plan Confirmation", StudentBuySubscriptionTemplate({ name, plan, duration: durationInMonths, startDate: moment().format("DD/MM/YYYY"), endDate: moment(expiryDate).format("DD/MM/YYYY"), url: `${config.FRONTEND_URL}/student/subscriptions` }));
            sendEmail("admin@spelleng.com", "Subscription Plan Confirmation", AdminStudentBuySubscriptionTemplate({ name, email, plan, date: moment().format("DD/MM/YYYY") }));
            res.json({ successMessage: 'Subscription is renewed and activated successfully' });
        } else {
            const newSubscription = new Subscription({
                razorpayPaymentId: razorpayPaymentId,
                user: req.user?._id,
                plan,
                status: 'active',
                classesPerMonth,
                totalClasses,
                amount,
                startDate,
                expiryDate
            });

            await newSubscription.save();

            // Send an email notification
            sendEmail(email, "Subscription Plan Confirmation", StudentBuySubscriptionTemplate({ name, plan, duration: durationInMonths, startDate: moment().format("DD/MM/YYYY"), endDate: moment(expiryDate).format("DD/MM/YYYY"), url: `${config.FRONTEND_URL}/student/subscriptions` }));
            sendEmail("admin@spelleng.com", "Subscription Plan Confirmation", AdminStudentBuySubscriptionTemplate({ name, email, plan, date: moment().format("DD/MM/YYYY") }));
            res.json({ successMessage: 'Subscription created and activated successfully' });
        }
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
