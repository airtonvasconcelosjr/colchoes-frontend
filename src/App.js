import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Link, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isUsuariosPage = location.pathname === '/usuarios';
  const isHomePage = location.pathname === '/home';

  return (
    <div className="App bg-black">
      <header className="w-full max-w mb-8 flex justify-between items-center bg-gray-900 px-8 py-6 rounded-lg shadow bg-black">
        <Link to="/home">
          <h1 className="text-xl font-bold text-white">Colchões</h1>
        </Link>
        <div className={isHomePage ? 'hidden' : 'block'}>
          <Link
            to={isUsuariosPage ? '/colchoes' : '/usuarios'}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
          >
            {isUsuariosPage ? 'Página de Colchões' : 'Página de Usuários'}
          </Link>
        </div>
      </header>

      <AppRoutes />
    </div>
  );
}

export default App;
