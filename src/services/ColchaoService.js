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

  // Verifique se a resposta é um array
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
