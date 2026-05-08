import Aeronave from "./aeronave"
import { lerArquivo } from "../services/readManager"
import salvarArquivo from "../services/fileManager"
import fs from "fs"

export default class Relatorio{
    id: number
    cliente: string
    dataEntrega: string
    aeronaveCodigo: string
    detalhes: string = ""

    constructor(cliente: string, dataEntrega: string, aeronave: Aeronave){
        this.cliente = cliente
        this.dataEntrega = dataEntrega
        this.aeronaveCodigo = aeronave.codigo

        const relatorios = lerArquivo("relatorios.json") || []
        this.id = relatorios.length + 1
    }

    gerarRelatorio(aeronave: Aeronave): void{
        if(!aeronave.todasEtapasConcluidas()){
            throw new Error("Não é possível gerar o relatório antes de concluir todas as etapas.")
        }

        if(!aeronave.todosTestesRealizados()){
            throw new Error("Não é possível gerar o relatório antes de realizar todos os testes.")
        }

        let texto = ""

        texto += "DADOS DA AERONAVE\n"
        texto += `Código: ${aeronave.codigo}\n`
        texto += `Modelo: ${aeronave.modelo}\n`
        texto += `Tipo: ${aeronave.tipo}\n`
        texto += `Capacidade: ${aeronave.capacidade}\n`
        texto += `Alcance: ${aeronave.alcance} km\n\n`

        texto += `CLIENTE: ${this.cliente}\n`
        texto += `DATA DE ENTREGA: ${this.dataEntrega}\n\n`

        texto += "PEÇAS\n"
        aeronave.pecas.forEach((p, index) => {
            texto += `[${index}] ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`
        })

        texto += "\nETAPAS\n"
        aeronave.etapas.forEach((e, index) => {
            texto += `[${index}] ${e.nome} | Status: ${e.status} | Prazo: ${e.prazo}\n`
        })

        texto += "\nTESTES\n"
        aeronave.testes.forEach((t, index) => {
            texto += `[${index}] ${t.tipo} | Resultado: ${t.resultado}\n`
        })

        texto += "\nSTATUS FINAL\n"
        texto += (
            aeronave.todosTestesRealizados() && aeronave.todosTestesAprovados()
            ? "APROVADA"
            : "REPROVADA"
        )

        this.detalhes = texto
    }

    salvarRelatorio(): void{
        if(!this.detalhes){
            throw new Error("Relatório não foi gerado.")
        }

        const nomeArquivo = `relatorio_${this.aeronaveCodigo}_${this.id}.txt`
        fs.writeFileSync(nomeArquivo, this.detalhes, "utf-8")

        const relatorios = lerArquivo("relatorios.json") || []

        relatorios.push({
            id: this.id,
            cliente: this.cliente,
            dataEntrega: this.dataEntrega,
            aeronave: this.aeronaveCodigo,
            arquivo: nomeArquivo
        })

        salvarArquivo("relatorios.json", relatorios)
        console.log(`Relatório salvo em: ${nomeArquivo}`)
    }
}