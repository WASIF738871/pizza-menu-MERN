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
      {pizzaList.length &&
        pizzaList.map((pizza, index) => (
          <Pizza key={pizza.id} pizza={pizza} />
        ))}
    </main>
  );
};

export default Menu;
