//-----inicio clasificacion-------

//clasificacion del producto
export interface Clasificacion {
    idClasificacion:number;
    nombre:string;    
    img:string,
    activo:boolean,
}

//para listar clasificaciones de productos
export interface RespuestaClasificaciones{
    total:number,
    clasificacion:Clasificacion[]
}

//para mostrar los datos de la clasificacion referenciada en un producto
export interface datoClasificacion{
    nombre:string;
}
//-----fin clasificacion-------