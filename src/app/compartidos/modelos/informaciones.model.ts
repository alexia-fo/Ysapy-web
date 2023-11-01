export interface Informacion{
    idInformacion:number;
    titulo:string;
    descripcion:string;
    fecha:Date;
}

export interface RespuestaInformaciones{
    informacion:Informacion[];
}