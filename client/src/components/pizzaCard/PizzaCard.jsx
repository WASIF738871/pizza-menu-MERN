import React from "react";

const PizzaCard = ({pizza,num}) => {
  return (
    <div>
      <img src={`http://localhost:3000/uploads/${pizza.photo}`} width={50} />
      <h3><span>{num}</span>: {pizza.name}</h3>
      <p>{pizza.photo}</p>
    </div>
  );
};

export default PizzaCard;
