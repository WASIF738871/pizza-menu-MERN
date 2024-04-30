const Footer = () => {
  const hour = new Date().getHours();
  const isOpen = hour >= 12 && hour <= 19;
  return (
    <div>
      <footer  className="footer">
        {" "}
        <strong>{new Date().toLocaleTimeString()}</strong>{" "}
        {isOpen ? "We're currently open" : "Sorry We're currently closed!"}
      </footer>
    </div>
  );
};

export default Footer;
