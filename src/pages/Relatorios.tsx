import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp, type Relatorio } from "../context/AppContext"
import { StatusEtapa } from "../enums/statusEtapa"
import { TipoTeste } from "../enums/tipoTeste"
import { ResultadoTeste } from "../enums/resultadoTeste"
import type { Aeronave } from "../types"

export default function Relatorios() {
  const { aeronaves, relatorios, adicionarRelatorio } = useApp()
  const navigate = useNavigate()

  const [codigoSelecionado, setCodigoSelecionado] = useState("")
  const [cliente, setCliente] = useState("")
  const [erro, setErro] = useState("")
  const [relatorioVisivel, setRelatorioVisivel] = useState<Relatorio | null>(null)

  function gerarDetalhes(aeronave: Aeronave, cliente: string): string {
    const tipos = Object.values(TipoTeste)
    const todosAprovados = aeronave.testes.every(t => t.resultado === ResultadoTeste.APROVADO)
    const todosRealizados = tipos.every(tipo => aeronave.testes.some(t => t.tipo === tipo))
    const statusFinal = todosRealizados && todosAprovados ? "APROVADA" : "REPROVADA"

    let texto = ""
    texto += `DADOS DA AERONAVE\n`
    texto += `Código: ${aeronave.codigo}\n`
    texto += `Modelo: ${aeronave.modelo}\n`
    texto += `Tipo: ${aeronave.tipo}\n`
    texto += `Capacidade: ${aeronave.capacidade}\n`
    texto += `Alcance: ${aeronave.alcance} km\n\n`
    texto += `CLIENTE: ${cliente}\n`
    texto += `DATA DE ENTREGA: ${new Date().toLocaleDateString()}\n\n`
    texto += `PEÇAS\n`
    aeronave.pecas.forEach((p, i) => {
      texto += `[${i}] ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`
    })
    texto += `\nETAPAS\n`
    aeronave.etapas.forEach((e, i) => {
      texto += `[${i}] ${e.nome} | Status: ${e.status} | Prazo: ${e.prazo}\n`
    })
    texto += `\nTESTES\n`
    aeronave.testes.forEach((t, i) => {
      texto += `[${i}] ${t.tipo} | Resultado: ${t.resultado}\n`
    })
    texto += `\nSTATUS FINAL: ${statusFinal}`

    return texto
  }

  function handleGerar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    const aeronave = aeronaves.find(a => a.codigo === codigoSelecionado)

    if (!aeronave) {
      setErro("Selecione uma aeronave válida.")
      return
    }

    if (!cliente) {
      setErro("Informe o nome do cliente.")
      return
    }

    const todasEtapasConcluidas = aeronave.etapas.length > 0 &&
      aeronave.etapas.every(e => e.status === StatusEtapa.CONCLUIDA)

    if (!todasEtapasConcluidas) {
      setErro("Todas as etapas devem estar concluídas para gerar o relatório.")
      return
    }

    const tipos = Object.values(TipoTeste)
    const todosTestesRealizados = tipos.every(tipo => aeronave.testes.some(t => t.tipo === tipo))

    if (!todosTestesRealizados) {
      setErro("Todos os testes devem ser realizados para gerar o relatório.")
      return
    }

    const todosTestesAprovados = aeronave.testes.every(t => t.resultado === ResultadoTeste.APROVADO)

    if (!todosTestesAprovados) {
      setErro("Todos os testes devem estar aprovados para gerar o relatório.")
      return
    }

    const novo: Relatorio = {
      id: relatorios.length + 1,
      cliente,
      dataEntrega: new Date().toLocaleDateString(),
      aeronaveCodigo: aeronave.codigo,
      detalhes: gerarDetalhes(aeronave, cliente)
    }

    adicionarRelatorio(novo)
    setCliente("")
    setCodigoSelecionado("")
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Relatórios</h1>
      </div>

      <div className="btn-group">
        <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
      </div>

      <hr />

      <h2>Gerar Relatório</h2>

      <form onSubmit={handleGerar}>
        <div>
          <label>Aeronave</label>
          <select value={codigoSelecionado} onChange={e => setCodigoSelecionado(e.target.value)}>
            <option value="">Selecione...</option>
            {aeronaves.map(a => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} — {a.modelo}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Cliente</label>
          <input value={cliente} onChange={e => setCliente(e.target.value)} />
        </div>
        {erro && <p className="error">{erro}</p>}
        <button type="submit">Gerar</button>
      </form>

      <hr />

      <h2>Relatórios Gerados</h2>

      {relatorios.length === 0 && <p>Nenhum relatório gerado.</p>}

      {relatorios.map(r => (
        <div key={r.id} className="list-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span>
              <strong>Relatório #{r.id}</strong> &nbsp;|&nbsp;
              Aeronave: {r.aeronaveCodigo} &nbsp;|&nbsp;
              Cliente: {r.cliente} &nbsp;|&nbsp;
              Data: {r.dataEntrega}
            </span>
            <button onClick={() => setRelatorioVisivel(relatorioVisivel?.id === r.id ? null : r)}>
              {relatorioVisivel?.id === r.id ? "Fechar" : "Ver Detalhes"}
            </button>
          </div>
          {relatorioVisivel?.id === r.id && (
            <pre>{r.detalhes}</pre>
          )}
        </div>
      ))}
    </div>
  )
}
