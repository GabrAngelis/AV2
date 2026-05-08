import { NivelPermissao } from "./enums/nivelPermissao"
import { StatusEtapa } from "./enums/statusEtapa"
import { StatusPeca } from "./enums/statusPeca"
import { TipoAeronave } from "./enums/tipoAeronave"
import { TipoPeca } from "./enums/tipoPeca"
import { TipoTeste } from "./enums/tipoTeste"
import { ResultadoTeste } from "./enums/resultadoTeste"

export interface Funcionario {
  id: string
  nome: string
  telefone: string
  endereco: string
  usuario: string
  senha: string
  nivelPermissao: NivelPermissao
}

export interface Peca {
  nome: string
  tipo: TipoPeca
  fornecedor: string
  status: StatusPeca
}

export interface Etapa {
  nome: string
  prazo: string
  status: StatusEtapa
  funcionarios: Funcionario[]
}

export interface Teste {
  tipo: TipoTeste
  resultado: ResultadoTeste
}

export interface Aeronave {
  codigo: string
  modelo: string
  tipo: TipoAeronave
  capacidade: number
  alcance: number
  pecas: Peca[]
  etapas: Etapa[]
  testes: Teste[]
}