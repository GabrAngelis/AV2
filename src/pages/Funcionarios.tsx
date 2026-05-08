import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { NivelPermissao } from "../enums/nivelPermissao"
import type { Funcionario } from "../types"

function nivelBadge(nivel: NivelPermissao) {
  if (nivel === NivelPermissao.ADMINISTRADOR) return "badge badge-red"
  if (nivel === NivelPermissao.ENGENHEIRO) return "badge badge-yellow"
  return "badge badge-blue"
}

export default function Funcionarios() {
  const { usuarioLogado, funcionarios, adicionarFuncionario } = useApp()
  const navigate = useNavigate()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState("")

  const [id, setId] = useState("")
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR)

  if (usuarioLogado?.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
    return (
      <div className="page-wrapper">
        <div className="access-denied">
          <h1>Acesso Negado</h1>
          <p>Apenas administradores podem acessar esta página.</p>
          <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
        </div>
      </div>
    )
  }

  function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (!id || !nome || !telefone || !endereco || !usuario || !senha) {
      setErro("Preencha todos os campos.")
      return
    }

    const novo: Funcionario = {
      id,
      nome,
      telefone,
      endereco,
      usuario,
      senha,
      nivelPermissao: nivel
    }

    try {
      adicionarFuncionario(novo)
      setId("")
      setNome("")
      setTelefone("")
      setEndereco("")
      setUsuario("")
      setSenha("")
      setNivel(NivelPermissao.OPERADOR)
      setMostrarForm(false)
    } catch (e: any) {
      setErro(e.message)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Funcionários</h1>
      </div>

      <div className="btn-group">
        <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
        <button onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "Novo Funcionário"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCriar}>
          <h2>Novo Funcionário</h2>

          <div>
            <label>ID</label>
            <input value={id} onChange={e => setId(e.target.value)} />
          </div>

          <div>
            <label>Nome</label>
            <input value={nome} onChange={e => setNome(e.target.value)} />
          </div>

          <div>
            <label>Telefone</label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>

          <div>
            <label>Endereço</label>
            <input value={endereco} onChange={e => setEndereco(e.target.value)} />
          </div>

          <div>
            <label>Usuário</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} />
          </div>

          <div>
            <label>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} />
          </div>

          <div>
            <label>Nível</label>
            <select value={nivel} onChange={e => setNivel(e.target.value as NivelPermissao)}>
              <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
              <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
              <option value={NivelPermissao.OPERADOR}>Operador</option>
            </select>
          </div>

          {erro && <p className="error">{erro}</p>}

          <button type="submit">Criar</button>
        </form>
      )}

      <hr />

      <h2>Funcionários Cadastrados</h2>

      {funcionarios.map(f => (
        <div key={f.id} className="list-item">
          <span>
            <strong>{f.nome}</strong> &nbsp;|&nbsp; {f.usuario} &nbsp;|&nbsp; Tel: {f.telefone}
          </span>
          <span className={nivelBadge(f.nivelPermissao)}>{f.nivelPermissao}</span>
        </div>
      ))}
    </div>
  )
}
