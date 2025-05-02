import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Colchoes from "../pages/Colchoes";
import Usuarios from "../pages/Usuarios";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute"; // importa aqui

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/colchoes"
        element={
          <PrivateRoute>
            <Colchoes />
          </PrivateRoute>
        }
      />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
