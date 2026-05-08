import { Navigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

export default function RotaProtegida({ children }: { children: JSX.Element }) {
  const { usuarioLogado } = useApp()
  if (!usuarioLogado) return <Navigate to="/" replace />
  return children
}