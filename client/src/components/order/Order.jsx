const openCloseHandler = () => {
  const openingHour = 12;
  const closingHour = 22;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  // Calculating openAt
  currentTime.setHours(openingHour);
  const openAt = currentTime.toLocaleTimeString();
  // Calculating closeAt
  currentTime.setHours(closingHour);
  const closeAt = currentTime.toLocaleTimeString();
  // Checking Restourant is open or closed
  const isOpen = currentHour >= openingHour && currentHour <= closingHour;
  // Return with all information
  return {
    currentTime: new Date().toLocaleTimeString(),
    isOpen,
    openAt,
    closeAt,
  };
};

const Order = () => {
  const { currentTime, isOpen, openAt, closeAt } = openCloseHandler();
  return (
    <div className="order">
      <p>
        <strong>{currentTime}</strong>
        {isOpen
          ? ` We're currently open!.We close at ${closeAt}`
          : ` Sorry We're currently closed!.We open at ${openAt}`}
      </p>
      {isOpen && <button className="btn">Order</button>}
    </div>
  );
};

export default Order;
