const API_URL = "http://localhost:8080/usuarios";

export const criarUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });
  return response.json();
};

export const ListarUsuarios = async () => {
  const response = await fetch(API_URL);
  const dados = await response.json();

  // Verifique se a resposta é um array
  if (Array.isArray(dados)) {
    return dados;
  } else {
    return [];  // Retorna um array vazio caso o retorno não seja um array
  }
};

export const DeletarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const EditarUsuario = async (id, dados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  return response.json();
};
