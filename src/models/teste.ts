import { ResultadoTeste } from "../enums/resultadoTeste";
import { TipoTeste } from "../enums/tipoTeste";
import salvarObjeto from "../services/objectManager";

export default class Teste{
    tipo: TipoTeste
    resultado: ResultadoTeste

    constructor(tipo: TipoTeste, resultado: ResultadoTeste){
        this.tipo = tipo
        this.resultado = resultado
    }

    salvarTeste(): void{
        salvarObjeto(this)
    }
}