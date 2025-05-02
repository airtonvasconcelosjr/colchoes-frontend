const API_URL = "http://localhost:8080/colchoes";

export const criarColchao = async (dadosColchao) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosColchao),
  });
  return response.json();
};

export const ListarColchoes = async () => {
  const response = await fetch(API_URL);
  const dados = await response.json();
  if (Array.isArray(dados)) {
    return dados;
  } else {
    return [];
  }
};

export const DeletarColchao = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const EditarColchao = async (id, dados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  return response.json();
};

export const uploadImagem = async (colchaoId, arquivo) => {
  const formData = new FormData();
  formData.append("imagem", arquivo);

  const response = await fetch(`${API_URL}/${colchaoId}/imagens`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const listarImagens = async (colchaoId) => {
  const response = await fetch(`${API_URL}/${colchaoId}/imagens`);
  const dados = await response.json();
  return dados;
};

export const deletarImagem = async (colchaoId, imagemId) => {
  const response = await fetch(`${API_URL}/${colchaoId}/imagens/${imagemId}`, {
    method: "DELETE",
  });
  return response.ok;
};

export const getImagemUrl = (colchaoId, imagemId) => {
  return `${API_URL}/${colchaoId}/imagens/${imagemId}`;
};
