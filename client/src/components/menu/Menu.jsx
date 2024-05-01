import { useEffect, useState } from "react";
import { PizzaApi } from "../../apis";
import { Pizza } from "../index";

const Menu = () => {
  const [pizzaList, setPizzaList] = useState([]);
  const fetchPizzaList = async () => {
    const pizzas = await PizzaApi.getPizzaList()
      .then((res) => res.json())
      .catch((err) => console.error(err));
    setPizzaList(pizzas);
  };

  useEffect(() => {
    fetchPizzaList();
  }, []);
  return (
    <main className="menu">
      <h2> Our menu</h2>
      {pizzaList.length ? (
        <ul className="pizzas">
          {pizzaList.map((pizza) => (
            <Pizza key={pizza.id} pizza={pizza} />
          ))}
        </ul>
      ) : (
        <p>We're still working on menu. Please come back later :)</p>
      )}
    </main>
  );
};

export default Menu;
