import { useState } from "react";
import { login } from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resposta = await login(email, password);
      localStorage.setItem("token", resposta.token);
      navigate("/colchoes", { state: { loginSuccess: true } });
    } catch (error) {
      if (!error.response) {
      } else {
        setErro("Email ou senha inválidos");
      }
      console.error("Erro no login:", error);
      toast.error("Erro no login. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative flex flex-col">
            <div className="relative z-0">
              <input
                type="email"
                name="email"
                id="email"
                className="w-full h-14 block leading-5 py-2 px-4 rounded bg-gray-700 border border-gray-500 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 text-white peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute tracking-[.03125em] text-gray-300 bg-gray-700 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Email
              </label>
            </div>
          </div>
          <div className="relative flex flex-col">
            <div className="relative z-0">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="password"
                id="password"
                className="w-full h-14 block leading-5 py-2 px-4 rounded bg-gray-700 border border-gray-500 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 text-white peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute tracking-[.03125em] text-gray-300 bg-gray-700 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Senha
              </label>
            </div>
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-300"
            >
              <FontAwesomeIcon icon={mostrarSenha ? faEye : faEyeSlash} />
            </button>
          </div>
          {erro && (
            <p className="text-red-500 text-sm">{erro}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
            <Link
              to="/usuarios"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex-1 text-center"
            >
              Criar Conta
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;