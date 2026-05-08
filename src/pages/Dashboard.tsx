import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { StatusEtapa } from "../enums/statusEtapa"
import { ResultadoTeste } from "../enums/resultadoTeste"
import { TipoTeste } from "../enums/tipoTeste"
import { NivelPermissao } from "../enums/nivelPermissao"

export default function Dashboard() {
  const { usuarioLogado, logout, aeronaves } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  const totalAeronaves = aeronaves.length

  const todasEtapasConcluidas = aeronaves.filter(a =>
    a.etapas.length > 0 && a.etapas.every(e => e.status === StatusEtapa.CONCLUIDA)
  ).length

  const todosTestesAprovados = aeronaves.filter(a => {
    const tipos = Object.values(TipoTeste)
    const todosRealizados = tipos.every(tipo => a.testes.some(t => t.tipo === tipo))
    const todosAprovados = a.testes.every(t => t.resultado === ResultadoTeste.APROVADO)
    return todosRealizados && todosAprovados
  }).length

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Usuário: {usuarioLogado?.nome} &nbsp;|&nbsp; Nível: {usuarioLogado?.nivelPermissao}</p>
      </div>

      <h2>Resumo</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="number">{totalAeronaves}</div>
          <div className="label">Total de aeronaves</div>
        </div>
        <div className="summary-card">
          <div className="number">{todasEtapasConcluidas}</div>
          <div className="label">Etapas concluídas</div>
        </div>
        <div className="summary-card">
          <div className="number">{todosTestesAprovados}</div>
          <div className="label">Aprovadas nos testes</div>
        </div>
      </div>

      <hr />

      <div className="btn-group">
        <button onClick={() => navigate("/producao")}>Ver Produção</button>
        <button onClick={() => navigate("/relatorios")}>Ver Relatórios</button>
        {usuarioLogado?.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
          <button onClick={() => navigate("/funcionarios")}>Gerenciar Funcionários</button>
        )}
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}
