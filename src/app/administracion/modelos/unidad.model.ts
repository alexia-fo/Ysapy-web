//-----inicio unidad-------

//datos de las unidades de medida de un productos
export interface Unidad {
    codUnidad:number;
    NombreUnidad:string;    
}

//para abmc de productos en modulo administracion (combo)
export interface RespuestaUnidades{
    total:number,
    unidad:Unidad[]
}

//-----fin unidad-------

// PARA ACCEDER A LOS DATOS DE UNIDADES (CUANDO SON LLAVES FORANEAS) 

export interface datoUnidad{
    NombreUnidad:string;
}