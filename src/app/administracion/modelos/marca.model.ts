//-----inicio marca-------

//datos de las marcas de medida de un productos
export interface Marca {
    codMarca:number;
    nombreMarca:string;    
}

//para abmc de productos en modulo administracion (combo)
export interface RespuestaMarcas{
    total:number,
    marca:Marca[]
}

//-----fin marca-------

// PARA ACCEDER A LOS DATOS DE MARCAS (CUANDO SON LLAVES FORANEAS) 

export interface datoUnidad{
    nombreMarca:string;
}