const Coupon = require('../models/couponModel');

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        if (coupons) {
            res.status(200).json(coupons);
        } else {
            res.status(404).json({ errorMessage: 'No coupons Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}


exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id });
        if (coupon) {
            res.status(200).json(coupon);
        } else {
            res.status(404).json({ errorMessage: 'No coupon found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.createCoupon = async (req, res) => {
    const { code, discount, startDate, endDate } = req.body;
    try {
        const coupon = new Coupon({
            code,
            discount,
            startDate,
            endDate
        });
        await coupon.save();
        res.status(200).json(coupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { code, discount, startDate, endDate } = req.body;
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            id,
            { code, discount, startDate, endDate },
            { new: true }
        );
        res.status(200).json(coupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.validateCoupon = async (req, res) => {
    const { code } = req.body;
    try {
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon is not valid' });
        }
        const now = new Date();
        if (coupon.startDate > now || coupon.endDate < now || !coupon.isActive) {
            return res.status(400).json({ message: 'Coupon is not valid' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id });
        if (coupon) {
            await coupon.remove()
            res.status(200).json({ successMessage: "Coupon deleted successfully" });
        } else {
            res.status(404).json({ errorMessage: 'No coupon found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}