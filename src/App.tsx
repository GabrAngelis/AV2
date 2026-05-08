import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import RotaProtegida from "./components/RotaProtegida";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Producao from "./pages/Producao";
import DetalhesAeronave from "./pages/DetalhesAeronave";
import Relatorios from "./pages/Relatorios";
import Funcionarios from "./pages/Funcionarios";
import './global.css'

import "./index.css";
import "./App.css";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Routes>


            <Route
              path="/"
              element={<Login />}
            />
            <Route
              path="/dashboard"
              element={
                <RotaProtegida>
                  <div className="page-container">
                    <Dashboard />
                  </div>
                </RotaProtegida>
              }
            />

            <Route
              path="/producao"
              element={
                <RotaProtegida>
                  <div className="page-container">
                    <Producao />
                  </div>
                </RotaProtegida>
              }
            />

            <Route
              path="/aeronave/:codigo"
              element={
                <RotaProtegida>
                  <div className="page-container">
                    <DetalhesAeronave />
                  </div>
                </RotaProtegida>
              }
            />

            <Route
              path="/relatorios"
              element={
                <RotaProtegida>
                  <div className="page-container">
                    <Relatorios />
                  </div>
                </RotaProtegida>
              }
            />

            <Route
              path="/funcionarios"
              element={
                <RotaProtegida>
                  <div className="page-container">
                    <Funcionarios />
                  </div>
                </RotaProtegida>
              }
            />

          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}