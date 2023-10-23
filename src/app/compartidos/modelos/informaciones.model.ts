export interface Informacion{
    titulo:string;
    descripcion:string;
    fecha:Date;
}

export interface RespuestaInformaciones{
    informacion:Informacion[];
}