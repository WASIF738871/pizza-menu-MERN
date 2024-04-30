
const Pizza = ({ pizza }) => {
  return (
    <div className="pizza">
      <img src={`http://localhost:3000/uploads/${pizza.photo}`} alt={pizza.name} />
      <h3> {pizza.name}</h3>
      <p>{pizza.ingredients}</p>
      <span>price: {pizza.price}$</span>
    </div>
  );
};

export default Pizza;
