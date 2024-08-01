import React from 'react';
import { formatCurrency } from '../CurrencyFormatter';
import CurrencySign from '../CurrencySign';

const PricingPlanCard = ({ plan, selectedClasses, selectedPlan, setSelectedPlan }) => {
    const currentPrice = plan.classes.find(c => c.count === selectedClasses).price;

    return (
        <div className={`planContainer ${selectedPlan === plan.duration && "selected"}`} onClick={() => setSelectedPlan(plan.duration)}>
            {/* {plan.discount && (
                <div className='save'>
                    <p>SAVE {plan.discount}%</p>
                </div>
            )} */}
            <div>
                <h6>{plan.duration}</h6>
                <p>No. of classes: <b>{selectedClasses * parseInt(plan.duration)}</b></p>
            </div>
            <div>
                <h4><CurrencySign />{formatCurrency(currentPrice / parseInt(plan.duration))} <small>/mo</small></h4>
            </div>
        </div>
    );
}; 

export default PricingPlanCard;
