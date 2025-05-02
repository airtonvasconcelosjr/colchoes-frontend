import React, { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUsuariosPage = location.pathname === "/usuarios";
  const isHomePage = location.pathname === "/home";
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Login realizado com sucesso!");
      window.history.replaceState({}, document.title);
    }

    if (location.state?.logoutSuccess) {
      toast.success("Logout realizado com sucesso!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logout: navegando para / com logoutSuccess");
    navigate("/home", { state: { logoutSuccess: true } });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App bg-black">
      <header className="w-full max-w mb-8 flex justify-between items-center bg-gray-900 px-8 py-6 rounded-lg shadow bg-black">
        <Link to="/home">
          <h1 className="text-xl font-bold text-white">Colchões</h1>
        </Link>
        <div style={{ display: isLoggedIn ? "block" : "none" }}>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                <ul className="text-white">
                  {isLoggedIn && (
                    <>
                      <li>
                        <Link
                          onClick={toggleMenu}
                          to={isUsuariosPage ? "/colchoes" : "/usuarios"}
                          className="block px-4 py-2 text-sm hover:bg-gray-700"
                        >
                          {isUsuariosPage ? "Página de Colchões" : "Página de Usuários"}
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => { handleLogout(); toggleMenu(); }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      <AppRoutes />
    </div>
  );
}

export default App;