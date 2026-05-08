import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { TipoAeronave } from "../enums/tipoAeronave"
import type { Aeronave } from "../types"

export default function Producao() {
  const { aeronaves, adicionarAeronave } = useApp()
  const navigate = useNavigate()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState("")

  const [codigo, setCodigo] = useState("")
  const [modelo, setModelo] = useState("")
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL)
  const [capacidade, setCapacidade] = useState("")
  const [alcance, setAlcance] = useState("")

  function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (aeronaves.some(a => a.codigo === codigo)) {
      setErro("Já existe uma aeronave com esse código.")
      return
    }

    if (!codigo || !modelo || !capacidade || !alcance) {
      setErro("Preencha todos os campos.")
      return
    }

    const nova: Aeronave = {
      codigo,
      modelo,
      tipo,
      capacidade: Number(capacidade),
      alcance: Number(alcance),
      pecas: [],
      etapas: [],
      testes: []
    }

    adicionarAeronave(nova)
    setCodigo("")
    setModelo("")
    setTipo(TipoAeronave.COMERCIAL)
    setCapacidade("")
    setAlcance("")
    setMostrarForm(false)
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Produção</h1>
      </div>

      <div className="btn-group">
        <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
        <button onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "Nova Aeronave"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCriar}>
          <h2>Nova Aeronave</h2>

          <div>
            <label>Código</label>
            <input value={codigo} onChange={e => setCodigo(e.target.value)} />
          </div>

          <div>
            <label>Modelo</label>
            <input value={modelo} onChange={e => setModelo(e.target.value)} />
          </div>

          <div>
            <label>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)}>
              <option value={TipoAeronave.COMERCIAL}>Comercial</option>
              <option value={TipoAeronave.MILITAR}>Militar</option>
            </select>
          </div>

          <div>
            <label>Capacidade</label>
            <input type="number" value={capacidade} onChange={e => setCapacidade(e.target.value)} />
          </div>

          <div>
            <label>Alcance (km)</label>
            <input type="number" value={alcance} onChange={e => setAlcance(e.target.value)} />
          </div>

          {erro && <p className="error">{erro}</p>}

          <button type="submit">Criar</button>
        </form>
      )}

      <hr />

      <h2>Aeronaves Cadastradas</h2>

      {aeronaves.length === 0 && <p>Nenhuma aeronave cadastrada.</p>}

      {aeronaves.map(a => (
        <div key={a.codigo} className="list-item">
          <span>
            <strong>{a.codigo}</strong> — {a.modelo} &nbsp;|&nbsp; {a.tipo} &nbsp;|&nbsp;
            Capacidade: {a.capacidade} &nbsp;|&nbsp; Alcance: {a.alcance} km
          </span>
          <button onClick={() => navigate(`/aeronave/${a.codigo}`)}>Ver Detalhes</button>
        </div>
      ))}
    </div>
  )
}
