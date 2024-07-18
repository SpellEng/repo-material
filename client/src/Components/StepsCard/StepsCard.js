import React from "react";
import "./StepsCard.css";

const StepsCard = ({ stepProps }) => {
  return (
    <div className="StepsCard">
      <button className="btn">
        {stepProps?.icon}
      </button>
      <h3>{stepProps?.heading}</h3>
      <p>{stepProps?.para}</p>
    </div>
  );
};

export default StepsCard;
