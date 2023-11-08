import { Producto } from "./inv-rend.model";

//verificacion de habilitacion
export interface salidaCabHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
}

//combinacion de datos de verificacion de habilitacion y si es que esta habilitado se obtienen productos, si no, no se obtienen los productos
export interface RespuestaDatos{
    mostrar: boolean;
    descripcion:string;
    producto?: Producto[];//se utilizan los mismos productos que se utilizan en inventario de productos
    salida?:Salida[];//tipos de salida
    idCabeceraInv?:number;
    fechaApertura?:Date;
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

//para visualizar las salidas

export interface SalidaVisualizar{
    idcsalida:number;
    idcabinventario:number;
    idproducto:number;
    idsalida:number;
    cantidad:number;
    total:number;
    Producto:{
        nombre:string;
        DInventarios:{precio:number, idproducto:number}[];// array de objetos de tipo dInventario --> es para obtener el precio del producto del inventario al cual corresponde(el array simpre tendra un solo objeto)
    }
}

export interface RespuestaSalidasVisualizar{
    dSalida:SalidaVisualizar[];
}

export interface RespuestaDatosVisualizarSalida{
    mostrar: boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
    dsalida?:SalidaVisualizar[];
}