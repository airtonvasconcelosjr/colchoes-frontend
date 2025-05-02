// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import colchao from "../assets/colchao.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (location.state?.logoutSuccess) {
      toast.success("Logout realizado com sucesso!");

      localStorage.removeItem("token");

      setIsLoggedIn(false);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <ToastContainer />
      <img
        src={colchao}
        alt="Colchão"
        className="w-80 h-80 object-cover mb-6 rounded-xl shadow-lg"
      />

      <h2 className="text-2xl font-bold mb-4">Bem-vindo à Loja de Colchões</h2>
      <p className="mb-6 text-center max-w-md">
        Conforto e qualidade para o seu sono. Faça login ou crie sua conta para continuar.
      </p>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <Link
            to="/colchoes"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Colchões
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
