import "./HomePage.css";
import { PizzaApi } from "../../apis";
import { useEffect, useState } from "react";
import { PizzaCard } from "../../components";

export const HomePage = () => {
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
    <div>
      <h1>
        Hello React! from <strong>wasif</strong>
      </h1>
      {pizzaList.length &&
        pizzaList.map((pizza ,index) => <PizzaCard key={pizza.id} pizza={pizza} num = {index} />)}
    </div>
  );
};
