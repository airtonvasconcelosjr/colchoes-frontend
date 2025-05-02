// Colchoes.jsx - Componente completo com suporte a imagens
import { useState, useEffect } from "react";
import {
  criarColchao,
  ListarColchoes,
  DeletarColchao,
  EditarColchao,
  uploadImagem,
  listarImagens,
  deletarImagem,
  getImagemUrl,
} from "../services/ColchaoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faImage,
  faImages,
  faTimes,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function Colchoes() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [preco, setPreco] = useState("");
  const [colchoes, setColchoes] = useState([]);
  const [colchaoEditando, setColchaoEditando] = useState(null);

  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [imagensColchao, setImagensColchao] = useState({});
  const [modalImagem, setModalImagem] = useState({ aberto: false, colchaoId: null, imagens: [] });

  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoColchao = { marca, modelo, preco };

    try {
      let colchaoSalvo;

      if (colchaoEditando) {
        colchaoSalvo = await EditarColchao(colchaoEditando.id, novoColchao);
        toast.success("Colchão editado com sucesso!");
      } else {
        colchaoSalvo = await criarColchao(novoColchao);
        toast.success("Colchão criado com sucesso!");
      }

      if (arquivosSelecionados.length > 0) {
        const colchaoId = colchaoEditando ? colchaoEditando.id : colchaoSalvo.id;

        for (const arquivo of arquivosSelecionados) {
          await uploadImagem(colchaoId, arquivo);
        }

        toast.success("Imagens carregadas com sucesso!");

        setArquivosSelecionados([]);
        setPreviewImagens([]);
      }

      await listarColchoes();
      limparFormulario();
    } catch (error) {
      toast.error("Erro ao criar/editar colchão.");
      console.error("Erro ao criar/editar colchão", error);
    }
  };

  const listarColchoes = async () => {
    try {
      const dados = await ListarColchoes();
      setColchoes(dados);

      const imagensTemp = {};
      for (const colchao of dados) {
        const imagens = await listarImagens(colchao.id);
        imagensTemp[colchao.id] = imagens;
      }
      setImagensColchao(imagensTemp);
    } catch (error) {
      console.error("Erro ao listar colchões", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeletarColchao(id);
      setColchoes(colchoes.filter((colchao) => colchao.id !== id));

      const novasImagens = { ...imagensColchao };
      delete novasImagens[id];
      setImagensColchao(novasImagens);

      toast.success("Colchão deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar colchão.");
      console.error("Erro ao deletar colchão", error);
    }
  };

  const handleEdit = (colchao) => {
    setMarca(colchao.marca);
    setModelo(colchao.modelo);
    setPreco(colchao.preco);
    setColchaoEditando(colchao);

    setArquivosSelecionados([]);
    setPreviewImagens([]);
  };

  const limparFormulario = () => {
    setMarca("");
    setModelo("");
    setPreco("");
    setColchaoEditando(null);
    setArquivosSelecionados([]);
    setPreviewImagens([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArquivosSelecionados([...arquivosSelecionados, ...files]);

    const newPreviewImagens = files.map((file) => ({
      arquivo: file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImagens([...previewImagens, ...newPreviewImagens]);
  };

  const removerArquivoSelecionado = (index) => {
    URL.revokeObjectURL(previewImagens[index].preview);

    const novosSelecionados = [...arquivosSelecionados];
    novosSelecionados.splice(index, 1);
    setArquivosSelecionados(novosSelecionados);

    const novosPreviews = [...previewImagens];
    novosPreviews.splice(index, 1);
    setPreviewImagens(novosPreviews);
  };

  const handleDeletarImagem = async (colchaoId, imagemId) => {
    try {
      await deletarImagem(colchaoId, imagemId);
      const imagensAtualizadas = { ...imagensColchao };
      imagensAtualizadas[colchaoId] = imagensAtualizadas[colchaoId].filter(
        (img) => img.id !== imagemId
      );
      setImagensColchao(imagensAtualizadas);

      if (modalImagem.aberto && modalImagem.colchaoId === colchaoId) {
        setModalImagem({
          ...modalImagem,
          imagens: modalImagem.imagens.filter((img) => img.id !== imagemId)
        });
      }

      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover imagem.");
      console.error("Erro ao remover imagem", error);
    }
  };

  const abrirModalImagens = async (colchaoId) => {
    try {
      const imagens = await listarImagens(colchaoId);
      setModalImagem({
        aberto: true,
        colchaoId,
        imagens
      });
    } catch (error) {
      console.error("Erro ao carregar imagens para o modal", error);
      toast.error("Erro ao carregar imagens.");
    }
  };

  const fecharModalImagens = () => {
    setModalImagem({ aberto: false, colchaoId: null, imagens: [] });
  };

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Login realizado com sucesso!");
      window.history.replaceState({}, document.title);
    }
    listarColchoes();

    return () => {
      previewImagens.forEach((preview) => URL.revokeObjectURL(preview.preview));
    };
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {colchaoEditando ? "Editar Colchão" : "Criar Colchão"}
        </h2>
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

          <div className="relative flex flex-col">
            <label className="mb-2 text-gray-300">Imagens do Colchão</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faImages} className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste
                    imagens
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG ou JPEG</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {previewImagens.length > 0 && (
            <div className="mt-2">
              <p className="mb-2 text-gray-300">Imagens selecionadas:</p>
              <div className="flex flex-wrap gap-2">
                {previewImagens.map((item, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={item.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removerArquivoSelecionado(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

      {colchoes.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="bg-blue-500 text-white p-4 rounded-t-lg">Lista de Colchões</h2>
          <ul className="bg-gray-800 rounded-b-lg divide-y divide-gray-700">
            {colchoes.map((colchao) => (
              <li key={colchao.id} className="flex justify-between p-4">
                <div className="flex flex-col">
                  <span className="font-medium">{colchao.marca}</span>
                  <span>{colchao.modelo}</span>
                  <span className="text-green-400">R$ {colchao.preco}</span>

                  {imagensColchao[colchao.id] && imagensColchao[colchao.id].length > 0 && (
                    <div className="flex mt-2 gap-2">
                      {imagensColchao[colchao.id].slice(0, 2).map((imagem) => (
                        <div key={imagem.id} className="w-12 h-12 relative">
                          <img
                            src={getImagemUrl(colchao.id, imagem.id)}
                            alt={imagem.nome}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                      {imagensColchao[colchao.id].length > 2 && (
                        <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-xs">
                          +{imagensColchao[colchao.id].length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => abrirModalImagens(colchao.id)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Gerenciar imagens"
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                  <button
                    onClick={() => handleEdit(colchao)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Editar colchão"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(colchao.id)}
                    className="text-red-400 hover:text-red-600"
                    title="Deletar colchão"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalImagem.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold">
                Imagens do Colchão {colchoes.find(c => c.id === modalImagem.colchaoId)?.marca} {colchoes.find(c => c.id === modalImagem.colchaoId)?.modelo}
              </h3>
              <button onClick={fecharModalImagens} className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {modalImagem.imagens.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma imagem disponível para este colchão.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {modalImagem.imagens.map((imagem) => (
                    <div key={imagem.id} className="relative group">
                      <img
                        src={getImagemUrl(modalImagem.colchaoId, imagem.id)}
                        alt={imagem.nome}
                        className="w-full h-40 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleDeletarImagem(modalImagem.colchaoId, imagem.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                          title="Remover imagem"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <div className="text-xs mt-1 truncate">{imagem.nome}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opção para adicionar novas imagens no modal */}
            <div className="p-4 border-t border-gray-700">
              <label className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer">
                <FontAwesomeIcon icon={faPlus} />
                <span>Adicionar novas imagens</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    try {
                      for (const file of files) {
                        await uploadImagem(modalImagem.colchaoId, file);
                      }

                      const imagens = await listarImagens(modalImagem.colchaoId);
                      setModalImagem({
                        ...modalImagem,
                        imagens
                      });

                      const novasImagens = { ...imagensColchao };
                      novasImagens[modalImagem.colchaoId] = imagens;
                      setImagensColchao(novasImagens);

                      toast.success(`${files.length} imagem(ns) adicionada(s) com sucesso!`);
                    } catch (error) {
                      console.error("Erro ao fazer upload de imagens", error);
                      toast.error("Erro ao fazer upload de imagens.");
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Colchoes;