import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { formatCurrency } from '../CurrencyFormatter';
import CurrencySign from '../CurrencySign';
import razorpay from "../../assets/razorpay.png"
import RazorPayComp from '../Payment/RazorPayComp';
import { isAuthenticated } from '../Auth/auth';
import axios from 'axios';
import { ErrorAlert, SuccessAlert } from '../Messages/messages';

const { Search } = Input;

const BillSummary = ({ selectedPlan, selectedClasses, pricingPlans }) => {
    const plan = pricingPlans.find(p => p.duration === selectedPlan);
    const [couponCode, setCouponCode] = useState("");
    const [discountFromCoupon, setDiscountFromCoupon] = useState(0);

    if (!plan) return null;

    const currentPrice = plan.classes.find(c => c.count === selectedClasses).price;
    const discount = plan.discount ? (currentPrice * plan.discount) / 100 : 0;
    const couponDiscountPrice = discountFromCoupon ? (currentPrice * discountFromCoupon) / 100 : 0;
    const netPrice = currentPrice - discount;

    const handleCouponValidation = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/coupons/validate`, { code: couponCode }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            });
            if (res.status === 200) {
                setDiscountFromCoupon(res.data.discount);
                SuccessAlert(`Coupon applied! Discount: ${res.data.discount}%`);
            }
        } catch (error) {
            ErrorAlert(error.response.data.message);
        }
    };

    return (
        <div className='billContainer'>
            <h4>Bill Summary</h4>
            <div className='item'>
                <h6>Base Price:</h6>
                <h6><CurrencySign />{formatCurrency(currentPrice)}</h6>
            </div>
            {discount > 0 && (
                <div className='item'>
                    <h6>Discount ({plan.discount}%):</h6>
                    <h6>-<CurrencySign />{formatCurrency(discount)}</h6>
                </div>
            )}
            {couponDiscountPrice > 0 && (
                <div className='item'>
                    <h6>Coupon Discount ({discountFromCoupon}%):</h6>
                    <h6>-<CurrencySign />{formatCurrency(couponDiscountPrice)}</h6>
                </div>
            )}
            <div className='item'>
                <h6>Net Price:</h6>
                <h6><CurrencySign />{formatCurrency(netPrice - couponDiscountPrice)}</h6>
            </div>
            <div className='item couponContainer'>
                <h6>Have a discount coupon?</h6>
                <div>
                    <Search
                        style={{ width: 200 }}
                        placeholder="Enter coupon code"
                        value={couponCode}
                        allowClear
                        onChange={(e) => setCouponCode(e.target.value)}
                        onSearch={handleCouponValidation}
                        enterButton="Apply"
                    />
                    {/* <Button onClick={handleCouponValidation}>Apply</Button> */}
                </div>
            </div>
            <div className='item mt-5'>
                <h6><b>Pay Now</b></h6>
                <h6><b><CurrencySign />{formatCurrency(netPrice - couponDiscountPrice)}</b></h6>
            </div>
            <div className='item mt-0 mb-4'>
                <button className='btn'>
                    <img src={razorpay} alt="Razorpay" style={{ width: "100px" }} />
                </button>
            </div>
            <RazorPayComp btnText={<div>Pay &nbsp; <CurrencySign />{formatCurrency(netPrice - couponDiscountPrice)}</div>} classesPerMonth={selectedClasses} studentId={isAuthenticated()?._id} plan={selectedPlan} amount={netPrice - couponDiscountPrice} />
            {/* <Button className='btn h-auto w-100 py-2 rounded-2 payBtn'>Pay &nbsp; <CurrencySign />{formatCurrency(netPrice)}</Button> */}
        </div>
    );
};

export default BillSummary;
