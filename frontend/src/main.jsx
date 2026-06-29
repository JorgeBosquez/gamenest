import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Home from "./Home.jsx";
import Cart from "./Cart.jsx";
import Admin from "./Admin.jsx";
import Library from "./Library.jsx";
import Favorites from "./Favorites.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/library" element={<Library />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  </BrowserRouter>
);