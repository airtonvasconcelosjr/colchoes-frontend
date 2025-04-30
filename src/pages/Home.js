// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import colchao from "../assets/colchao.jpg";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
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
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
        <Link
          to="/usuarios"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Criar Conta
        </Link>
      </div>
    </div>
  );
}

export default Home;
