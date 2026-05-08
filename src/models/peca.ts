import { StatusPeca } from "../enums/statusPeca"
import { TipoPeca } from "../enums/tipoPeca"
import salvarObjeto from "../services/objectManager"

export default class Peca{
    nome: string
    tipo: TipoPeca
    fornecedor: string
    status: StatusPeca

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca){
        this.nome = nome
        this.tipo = tipo
        this.fornecedor = fornecedor
        this.status = status
    }

    atualizarStatus(): void {
        switch(this.status){
            case StatusPeca.EM_PRODUCAO:
                this.status = StatusPeca.EM_TRANSPORTE
                break
            case StatusPeca.EM_TRANSPORTE:
                this.status = StatusPeca.PRONTA
                break
            case StatusPeca.PRONTA:
                throw new Error("Peça já está finalizada")
            }
        }

    salvarPeca(): void{
        salvarObjeto(this)
    }
}