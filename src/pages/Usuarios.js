import { useState, useEffect } from "react";
import { criarUsuario, ListarUsuarios, DeletarUsuario, EditarUsuario } from "../services/UsuarioService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Usuarios() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [backendOffline, setBackendOffline] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const dados = await ListarUsuarios();
      setUsuarios(dados);
      setBackendOffline(false);
    } catch (error) {
      setBackendOffline(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const novoUsuario = { nome, email, password };

    try {
      if (usuarioEditando) {
        await EditarUsuario(usuarioEditando.id, novoUsuario);
      } else {
        await criarUsuario(novoUsuario);
      }

      toast.success("Usuário salvo com sucesso!");
      limparFormulario();
      listarUsuarios();

    } catch (error) {
      if (!error.response) {
        setErro("Erro de conexão com o servidor.");
      } else {
        setErro("Erro ao salvar o usuário.");
      }
      toast.error("Erro ao salvar usuário.");
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeletarUsuario(id);
      toast.success("Usuário deletado com sucesso!");
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      toast.error("Erro ao deletar colchão.");
      console.error("Erro ao deletar usuário", error);
    }
  };

  const handleEdit = (usuario) => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setPassword(usuario.password);
    setUsuarioEditando(usuario);
  };

  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setPassword("");
    setUsuarioEditando(null);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuários</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-600"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-600"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white flex-1"
            >
              {usuarioEditando ? "Editar" : "Criar"}
            </button>
            {usuarioEditando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white"
              >
                Cancelar
              </button>
            )}
          </div>

          {erro && (
            <span className="text-red-500 text-sm text-center">
              {erro}
            </span>
          )}
        </form>

        <div style={{ display: usuarios.length > 0 ? "block" : "none" }}>
          <h2 className="text-xl font-bold mt-10 mb-4">Lista de Usuários</h2>
          <ul className="divide-y divide-gray-700">
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <li key={usuario.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">{usuario.nome}</p>
                    <p className="text-sm text-gray-400">{usuario.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(usuario)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(usuario.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400">Nenhum usuário encontrado</li>
            )}
          </ul>

        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Usuarios;
