import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      login(usuario, senha)
      navigate("/dashboard")
    } catch (e: any) {
      setErro(e.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuário</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} />
          </div>
          {erro && <p className="error">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
