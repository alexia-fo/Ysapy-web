//-----inicio clasificacion-------

//datos de las clasificaciones de un productos
export interface Clasificacion {
    idClasificacion:number;
    nombre:string;    
}

//para abmc de productos en modulo administracion (combo)
export interface RespuestaClasificaciones{
    total:number,
    clasificacion:Clasificacion[]
}

//-----fin clasificacion-------

// PARA ACCEDER A LOS DATOS DE CLASIFICACIONES (CUANDO SON LLAVES FORANEAS) 
// para ver el nombre de la clasificacion al listar el producto en la tabla

export interface datoClasificacion{
    nombre:string;
}