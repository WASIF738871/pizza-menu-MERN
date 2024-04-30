import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { HomePage } from "./pages";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
