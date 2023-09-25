import { Producto } from "./inv-rend.model";

//verificacion de habilitacion
export interface salidaCabHabilitado{
    habilitado:boolean;
    descripcion:string;
}

//combinacion de datos de verificacion de habilitacion y si es que esta habilitado se obtienen productos, si no, no se obtienen los productos
export interface RespuestaDatos{
    mostrar: boolean;
    descripcion:string;
    producto?: Producto[];//se utilizan los mismos productos que se utilizan en inventario de productos
    salida?:Salida[];//tipos de salida
}

export interface Salida{
    idSalida:number;
    descripcion:string;
}

export interface RespuestaSalidas{
    total:number;
    salida:Salida[];
}

//para agregar productos a la tabla de salidas
export interface ProdEnBaja{
    idProducto:number;
    nombre:string;
    cantidad:number;
    salida:Salida;
}
//datos enviados para registrar el listado de salidas
export interface GuardarSalida{
    observacion:string;
    productos:ProdEnBaja[];
}
