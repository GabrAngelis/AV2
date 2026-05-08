import { NivelPermissao } from "../enums/nivelPermissao"
import salvarObjeto from "../services/objectManager"
import { lerArquivo } from "../services/readManager"

export default class Funcionario{
    id: string
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivelPermissao: NivelPermissao

   constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha:string, nivelPermissao: NivelPermissao){
    this.id = id
    this.nome = nome
    this.telefone = telefone
    this.endereco = endereco
    this.usuario = usuario
    this.senha = senha
    this.nivelPermissao = nivelPermissao
   }

   salvarFuncionario(): void{
    const funcionarios = lerArquivo("funcionarios.json") || []
    const existe = funcionarios.find((f: any) => f.usuario === this.usuario)

    if(existe){
        throw new Error("Usuário já existe.")
    }

    salvarObjeto(this)
   }

   static autenticar(usuario: string, senha: string): any{
    const funcionarios = lerArquivo("funcionarios.json") || []
    const encontrado = funcionarios.find(
        (f: any) => f.usuario === usuario && f.senha === senha
    )

    if(!encontrado){
        throw new Error("Usuário ou senha inválidos.")
    }
    return encontrado
   }
}