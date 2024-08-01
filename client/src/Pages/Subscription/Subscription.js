import React, { useState } from 'react';
import { Select } from 'antd';
import { GiCheckMark } from "react-icons/gi";
import "./Subscription.css";
import PricingPlanCard from '../../Components/Subscription/PricingCard';
import BillSummary from '../../Components/Subscription/BillSummary';

const Subscription = () => {
  const [selectedClasses, setSelectedClasses] = useState(12);
  const [selectedPlan, setSelectedPlan] = useState("3 Month");

  const pricingPlans = [
    {
      duration: "1 Month",
      classes: [
        { count: 12, price: 6700 },
        { count: 20, price: 8500 }
      ]
    },
    {
      duration: "3 Months",
      classes: [
        { count: 12, price: 16000 },
        { count: 20, price: 20000 }
      ],
      discount: 19
    },
    {
      duration: "6 Months",
      classes: [
        { count: 12, price: 30000 },
        { count: 20, price: 35000 }
      ],
      discount: 24
    }
  ];

  console.log(selectedPlan);

  return (
    <div className="Subscription">
      <div className="inner container">
        <div>
          <h3 className='text-center'>Choose a plan that suits your need</h3>
          <div className="features">
            <ul>
              {
                [
                  "1-1 Live Class",
                  `${selectedClasses} Classes Per Month`,
                  "30 Minutes Per Class",
                  "Class Recording",
                  "Expert Feedback",
                  "Flexible Timing",
                ]?.map((feature, index) => {
                  return (
                    <li key={index}>
                      <GiCheckMark /> {feature}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
        <div className="subscriptionContainer">
          <div className="subscriptionPlanContainer">
            <div className="classesBtns">
              <h6>Select No. of classes</h6>
              <Select
                defaultValue={12}
                className='classesSelect'
                onChange={(val) => setSelectedClasses(val)}
                options={[
                  {
                    value: 12,
                    label: "12 Classes per month",
                  },
                  {
                    value: 20,
                    label: "20 Classes per month",
                  }
                ]}
              />
            </div>
            {pricingPlans.reverse().map(plan => (
              <PricingPlanCard
                key={plan.duration}
                plan={plan}
                selectedClasses={selectedClasses}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
            ))}
            {/* </div> */}
          </div>
          <BillSummary
            selectedPlan={selectedPlan}
            selectedClasses={selectedClasses}
            pricingPlans={pricingPlans}
          />
        </div>
      </div>
    </div >
  );
}

export default Subscription;