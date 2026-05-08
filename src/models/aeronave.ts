import { TipoAeronave } from "../enums/tipoAeronave"
import salvarObjeto from "../services/objectManager"
import Etapa from "./etapa";
import Peca from './peca';
import Teste from "./teste";
import { StatusEtapa } from "../enums/statusEtapa";
import { StatusPeca } from "../enums/statusPeca";
import { ResultadoTeste } from "../enums/resultadoTeste";
import { TipoTeste } from "../enums/tipoTeste";

export default class Aeronave{
    codigo: string
    modelo: string
    tipo: TipoAeronave
    capacidade: number
    alcance: number

    pecas: Peca[] = []
    etapas: Etapa[] = []
    testes: Teste[] = []


    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number){
        this.codigo = codigo
        this.modelo = modelo
        this.tipo = tipo
        this.capacidade = capacidade
        this.alcance = alcance
        this.pecas = []
        this.etapas = []
        this.testes = []
    }

    adicionarPeca(peca: Peca): void{
        const existe = this.pecas.find(p => p.nome === peca.nome)
        if(existe){
            throw new Error("Peça já adicionada.")
        }
        this.pecas.push(peca)
    }

    salvarAeronave(){
        salvarObjeto(this)
    }

    listarPecas(): void{
        if(this.pecas.length === 0){
            console.log("Nenhuma peça cadastrada.")
            return
        }
        console.log("Peças da aeronave:")
        this.pecas.forEach((peca, index) => {
            console.log(`[${index}] ${peca.nome} | Tipo: ${peca.tipo} | Status: ${peca.status}`)
        })
    }

    todasPecasProntas(): boolean{
        return this.pecas.every(p => p.status === StatusPeca.PRONTA)
    }

    adicionarEtapa(etapa: Etapa): void{
        this.etapas.push(etapa)
    }

    iniciarEtapa(index: number): void{
        const etapa = this.etapas[index]
        if(!etapa){
            throw new Error("Etapa não encontrada.")
        }

        if(!this.todasPecasProntas()){
            throw new Error("Todas as peças devem estar prontas.")
        }

        if(index > 0 && this.etapas[index - 1].status !== StatusEtapa.CONCLUIDA){
            throw new Error("Etapa anterior não foi concluída.")
        }

        etapa.iniciar()
    }

    finalizarEtapa(index: number): void{
        const etapa = this.etapas[index]
        if(!etapa){
            throw new Error("Etapa não encontrada.")
        }
        etapa.finalizar()
    }

    listarEtapas(): void{
        if(this.etapas.length === 0){
            console.log("Nenhuma etapa cadastrada.")
            return
        }

        console.log("ETAPAS DA AERONAVE")
        this.etapas.forEach((etapa, index) => {
            console.log(`[${index}] ${etapa.nome} | Status: ${etapa.status} | Prazo: ${etapa.prazo}`)
        })
    }

    todasEtapasConcluidas(): boolean{
        return this.etapas.every(etapa => etapa.status === StatusEtapa.CONCLUIDA)
    }

    adicionarTeste(teste: Teste): void{
        if(!this.todasEtapasConcluidas()){
            throw new Error("Não é possível adicionar teste antes de concluir todas as etapas.")
        }

        const existe = this.testes.find(t => t.tipo === teste.tipo)
        if(existe){
            throw new Error("Teste desse tipo já foi realizado.")
        }

        this.testes.push(teste)
    }

    todosTestesRealizados(): boolean{
        const tipos = Object.values(TipoTeste) as TipoTeste[]
        return tipos.every(tipo => this.testes.some(t => t.tipo === tipo))
    }

    todosTestesAprovados(): boolean{
        return this.testes.every(teste => teste.resultado === ResultadoTeste.APROVADO)
    }

    listarTestes(): void{
        if(this.testes.length === 0){
            console.log("Nenhum teste realizado.")
            return
        }

        console.log("TESTES DA AERONAVE")
        this.testes.forEach((teste, index) => {
            console.log(`[${index}] ${teste.tipo} | Resultado: ${teste.resultado}`)
        })
    }

    detalhes(): void{
        console.log(`Detalhes da aeronave:
Codigo: ${this.codigo}
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance} km`)
        this.listarPecas()
        this.listarEtapas()
        this.listarTestes()

        console.log(`
Status final: ${
            this.todosTestesRealizados() && this.todosTestesAprovados()
            ? "APROVADA"
            : "REPROVADA"
        }
`)
    }
}