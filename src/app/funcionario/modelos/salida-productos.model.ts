import { Producto } from "./inventario.model";

export interface ProdEnBaja{
    idProducto:number;
    nombre:string;
    cantidad:number;
    salida:Salida;
}


///respuestas del backend

export interface salidaCabHabilitado{
    habilitado:boolean;
    descripcion:string;
}

// export interface Producto{
//     idProducto:number;
//     nombre:string;
//     precio:number;
//     descripcion:string;
//     //el resto de los datos no son necesarios
// }

// export interface RespuestaProductos{
//     total:number,
//     producto:Producto[]
// }



export interface RespuestaDatos{
    mostrar: boolean;
    descripcion:string;
    producto?: Producto[];
    salida?:Salida[];
}
//datos enviados para registrar recepcion



///para el combo

export interface Salida{
    idSalida:number;
    descripcion:string;
}

export interface RespuestaSalidas{
    total:number;
    salida:Salida[];
}

export interface GuardarSalida{
    observacion:string;
    productos:ProdEnBaja[];
}
