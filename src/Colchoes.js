import { useState, useEffect } from "react";
import { criarColchao, ListarColchoes, DeletarColchao, EditarColchao } from "./services/ColchaoService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

function Colchoes() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [preco, setPreco] = useState("");
  const [colchoes, setColchoes] = useState([]);
  const [colchaoEditando, setColchaoEditando] = useState(null); // Estado para armazenar colchão editando

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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Marca do colchão"
        />
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo do colchão"
        />
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="Preço do colchão"
        />
        <button type="submit">{colchaoEditando ? "Editar Colchão" : "Criar Colchão"}</button>
        {colchaoEditando && (
          <button type="button" onClick={limparFormulario}>
            Cancelar Edição
          </button>
        )}
      </form>

      <h2>Lista de Colchões</h2>
      <ul>
        {colchoes.map((colchao) => (
          <li key={colchao.id}>
            {colchao.marca} - {colchao.modelo} - {colchao.preco}
            <button onClick={() => handleEdit(colchao)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(colchao.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Colchoes;
