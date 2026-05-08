import { StatusEtapa } from '../enums/statusEtapa';
import Funcionario from './funcionario';

export default class Etapa{
    nome: string
    prazo: string
    status: StatusEtapa
    funcionarios: Funcionario[]

    constructor(nome: string, prazo: string, status: StatusEtapa, funcionarios: Funcionario[]){
        this.nome = nome
        this.prazo = prazo
        this.status = status
        this.funcionarios = funcionarios
    }

    associarFuncionario(funcionario: Funcionario): void{
        const existe = this.funcionarios.find(f => f.id === funcionario.id)
        if(existe){
            throw new Error('Funcionário já associado.')
        }
        this.funcionarios.push(funcionario)
    }

    listarFuncionarios(): void{
        this.funcionarios.forEach(f => {
            console.log(`${f.nome} - ${f.nivelPermissao}`)
        })
    }

    iniciar(){
        if(this.status !== StatusEtapa.PENDENTE){
            throw new Error("Etapa já iniciada!")
        }
        this.status = StatusEtapa.ANDAMENTO
    }

    finalizar(){
        if(this.status !== StatusEtapa.ANDAMENTO){
            throw new Error("Etapa não foi iniciada!")
        }
        this.status = StatusEtapa.CONCLUIDA
    }
}