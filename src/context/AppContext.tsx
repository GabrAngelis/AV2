import { createContext, useContext, useState, ReactNode } from "react"
import { NivelPermissao } from "../enums/nivelPermissao"
import type { Funcionario, Aeronave } from "../types"

export interface Relatorio {
  id: number
  cliente: string
  dataEntrega: string
  aeronaveCodigo: string
  detalhes: string
}

const seedFuncionarios: Funcionario[] = [
  { id: "1", nome: "Admin", telefone: "123456789", endereco: "Rua dos admin, 1", usuario: "admin", senha: "admin123", nivelPermissao: NivelPermissao.ADMINISTRADOR },
  { id: "2", nome: "Engenheiro", telefone: "987654321", endereco: "Rua dos engenheiros, 2", usuario: "engenheiro", senha: "eng123", nivelPermissao: NivelPermissao.ENGENHEIRO },
  { id: "3", nome: "Operador", telefone: "111111111", endereco: "Rua dos operadores, 3", usuario: "operador", senha: "op123", nivelPermissao: NivelPermissao.OPERADOR },
]

interface AppContextType {
  usuarioLogado: Funcionario | null
  funcionarios: Funcionario[]
  aeronaves: Aeronave[]
  relatorios: Relatorio[]
  login: (usuario: string, senha: string) => void
  logout: () => void
  adicionarAeronave: (a: Aeronave) => void
  atualizarAeronave: (a: Aeronave) => void
  adicionarRelatorio: (r: Relatorio) => void
  adicionarFuncionario: (f: Funcionario) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(seedFuncionarios)
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])

  function login(usuario: string, senha: string) {
    const encontrado = funcionarios.find(f => f.usuario === usuario && f.senha === senha)
    if (!encontrado) throw new Error("Usuário ou senha inválidos.")
    setUsuarioLogado(encontrado)
  }

  function logout() {
    setUsuarioLogado(null)
  }

  function adicionarAeronave(a: Aeronave) {
    setAeronaves(prev => [...prev, a])
  }

  function atualizarAeronave(atualizada: Aeronave) {
    setAeronaves(prev => prev.map(a => a.codigo === atualizada.codigo ? atualizada : a))
  }

  function adicionarRelatorio(r: Relatorio) {
    setRelatorios(prev => [...prev, r])
  }

  function adicionarFuncionario(f: Funcionario) {
    const existe = funcionarios.find(func => func.usuario === f.usuario)
    if (existe) throw new Error("Usuário já existe.")
    setFuncionarios(prev => [...prev, f])
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado,
      funcionarios,
      aeronaves,
      relatorios,
      login,
      logout,
      adicionarAeronave,
      atualizarAeronave,
      adicionarRelatorio,
      adicionarFuncionario
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp fora do AppProvider")
  return ctx
}