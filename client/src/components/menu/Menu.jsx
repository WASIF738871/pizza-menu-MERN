import { Fragment, useEffect, useState } from "react";
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
        <Fragment>
          <p>Authentic italian cuisine. Some creative dishes to choose from. All from our stone oven, all orgainic, all delicious.</p>
        <ul className="pizzas">
          {pizzaList.map((pizza) => (
            <Pizza key={pizza.id} pizza={pizza} />
          ))}
        </ul>
        </Fragment>
      ) : (
        <p>We're still working on menu. Please come back later :)</p>
      )}
    </main>
  );
};

export default Menu;
