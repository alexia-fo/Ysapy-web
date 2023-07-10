
//para el array
export interface ProdRecibido{
    idProducto:number;
    nombre:string;
    cantidad:number;
}

//
export interface recCabHabilitado{
    habilitado:boolean;
    descripcion:string;
}

export interface Producto{
    idProducto:number;
    nombre:string;
    precio:number;
    descripcion:string;
    //el resto de los datos no son necesarios
}

export interface RespuestaProductos{
    total:number,
    producto:Producto[]
}



export interface RespuestaDatos{
    mostrar: boolean;
    descripcion:string;
    producto?: Producto[];
}
//datos enviados para registrar recepcion
