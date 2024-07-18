import React from 'react'
import { GiCheckMark } from 'react-icons/gi'
import { isAuthenticated } from '../Auth/auth'
import CurrencySign from '../CurrencySign'
import RazorPayComp from '../Payment/RazorPayComp'
import './PricingCard.css'

export const PricingCard = ({ id, title, btnText, features, totalPrice, discountedPrice, classesPerMonth }) => {

    return (
        <div className={`PricingCard ${id === 2 && "active"}`}>
            <div>
                <h1>{title} </h1>
                <div className='totalPrice'>
                    <h6><CurrencySign />{totalPrice}</h6>
                    <div className='save'>SAVE {parseInt(discountedPrice / totalPrice * 100)}%</div>
                </div>
                <h4><CurrencySign />{discountedPrice}/mo</h4>
                <div className={`${id === 2 && "active"}`}>
                    <RazorPayComp btnText={btnText} classesPerMonth={classesPerMonth} studentId={isAuthenticated()?._id} plan={title} amount={discountedPrice} />
                    {/* <button
                    className={id === 2 && "active"}
                // onClick={() => addToCart({ planType, productId: id, classes, type, title, subTitle: text, price: updatePrice, qty: 1, features, proFeatures, status: "Activo", classes })}
                >
                    {btnText}
                </button> */}
                </div>
                <hr />
                <div className="features">
                    <ul>
                        {
                            features?.map((feature, index) => {
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
        </div>
    )
}
