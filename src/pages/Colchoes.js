import { useState, useEffect } from "react";
import { criarColchao, ListarColchoes, DeletarColchao, EditarColchao } from "../services/ColchaoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";


function Colchoes() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [preco, setPreco] = useState("");
  const [colchoes, setColchoes] = useState([]);
  const [colchaoEditando, setColchaoEditando] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoColchao = { marca, modelo, preco };

    if (colchaoEditando) {
      const resposta = await EditarColchao(colchaoEditando.id, novoColchao);
      console.log("Colchão editado:", resposta);
    } else {
      const resposta = await criarColchao(novoColchao);
      console.log("Colchão criado:", resposta);
    }

    listarColchoes();
    limparFormulario();
  };

  const listarColchoes = async () => {
    try {
      const dados = await ListarColchoes();
      setColchoes(dados);
    } catch (error) {
      console.error("Erro ao listar colchões", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeletarColchao(id);
      setColchoes(colchoes.filter((colchao) => colchao.id !== id));
      console.log("Colchão deletado com sucesso");
    } catch (error) {
      console.error("Erro ao deletar colchão", error);
    }
  };

  const handleEdit = (colchao) => {
    setMarca(colchao.marca);
    setModelo(colchao.modelo);
    setPreco(colchao.preco);
    setColchaoEditando(colchao);
  };

  const limparFormulario = () => {
    setMarca("");
    setModelo("");
    setPreco("");
    setColchaoEditando(null);
  };

  useEffect(() => {
    listarColchoes();
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4 text-white">

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Colchão</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative flex flex-col">
            <div className="relative z-0">
              <input
                type="text"
                name="marca"
                id="marca"
                className="w-full h-14 block leading-5 py-2 px-4 rounded bg-gray-700 border border-gray-500 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 text-white peer"
                placeholder=" "
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
              <label
                htmlFor="marca"
                className="absolute tracking-[.03125em] text-gray-300 bg-gray-700 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Marca do colchão
              </label>
            </div>
          </div>

          <div className="relative flex flex-col">
            <div className="relative z-0">
              <input
                type="text"
                name="modelo"
                id="modelo"
                className="w-full h-14 block leading-5 py-2 px-4 rounded bg-gray-700 border border-gray-500 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 text-white peer"
                placeholder=" "
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
              <label
                htmlFor="modelo"
                className="absolute tracking-[.03125em] text-gray-300 bg-gray-700 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Modelo do colchão
              </label>
            </div>
          </div>

          <div className="relative flex flex-col">
            <div className="relative z-0">
              <input
                type="number"
                name="preco"
                id="preco"
                className="w-full h-14 block leading-5 py-2 px-4 rounded bg-gray-700 border border-gray-500 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 text-white peer"
                placeholder=" "
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
              <label
                htmlFor="preco"
                className="absolute tracking-[.03125em] text-gray-300 bg-gray-700 duration-300 transform px-1 -translate-y-7 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Preço do colchão
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1"
            >
              {colchaoEditando ? "Editar Colchão" : "Criar Colchão"}
            </button>
            {colchaoEditando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="bg-blue-500 text-white p-4 rounded-t-lg">Lista de Colchões</h2>
        <ul className="bg-gray-800 rounded-b-lg divide-y divide-gray-700">
          {colchoes.map((colchao) => (
            <li key={colchao.id} className="flex justify-between p-4">
              <div className="flex flex-col">
                <span>{colchao.marca}</span>
                <span>{colchao.modelo}</span>
                <span>R$ {colchao.preco}</span>
              </div>
              <div className="flex gap-4 items-center">
                <button onClick={() => handleEdit(colchao)} className="text-blue-400 hover:text-blue-600">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(colchao.id)} className="text-red-400 hover:text-red-600">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Colchoes;
