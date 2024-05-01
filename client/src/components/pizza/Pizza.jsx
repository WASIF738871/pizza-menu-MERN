const Pizza = ({ pizza }) => {
  return (
    <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}>
      <img
        src={`http://localhost:3000/uploads/${pizza.photo}`}
        alt={pizza.name}
      />
      <div>
        <h3> {pizza.name}</h3>
        <p>{pizza.ingredients}</p>
        <span>{pizza.soldOut ? `SOLD OUT` : `price: ${pizza.price}$`}</span>
      </div>
    </li>
  );
};

export default Pizza;
