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
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro na resposta do servidor: " + response.status);
    }

    const dados = await response.json();
    return Array.isArray(dados) ? dados : [];
  } catch (error) {
    throw error; // <-- Só lança, quem decide o que fazer é o componente
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
