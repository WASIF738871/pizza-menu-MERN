export  class PizzaApi {
  static updatePizza(pizza_id, body, token) {
    const url = `http://localhost:3000/api/v1/pizzas/${pizza_id}/`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
      json: true,
    };
    return fetch(url, options);
  }
  static createPizza(body, token) {
    const url = `http://localhost:3000/api/v1/pizzas/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options);
  }
  static deletePizza(pizza_id, token) {
    const url = `http://localhost:3000/api/v1/pizzas/${pizza_id}/`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${token}`,
      },
    };
    return fetch(url, options);
  }
  static getPizzaList(token) {
    const url = `http://localhost:3000/api/v1/pizzas`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${token}`,
      },
    };
    return fetch(url, options);
  }
}
