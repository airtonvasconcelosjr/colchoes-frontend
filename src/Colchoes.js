import React, { useEffect, useState } from "react";
import axios from "axios";

const Colchoes = () => {
  const [colchoes, setColchoes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/colchoes")
      .then((response) => {
        console.log(response)
        setColchoes(response.data); 
      })
      .catch((error) => {
        console.error("Houve um erro ao buscar os colchões!", error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Colchões</h1>
      <ul>
        {colchoes.map((colchao) => (
          <li key={colchao.id}>{colchao.id}{colchao.modelo}</li>
        ))}
      </ul>
    </div>
  );
};

export default Colchoes;
