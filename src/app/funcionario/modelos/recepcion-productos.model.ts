import { Producto } from "./inv-rend.model";

//verificacion de habilitacion
export interface recCabHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;

    //!
    proximoNroComprobante?:number;
}

//combinacion de datos de verificacion de habilitacion y si es que esta habilitado se obtienen productos, si no, no se obtienen los productos
export interface RespuestaDatos{
    mostrar: boolean;
    descripcion:string;
    producto?: Producto[]; //se utilizan los mismos productos que se utilizan en inventario de productos
    idCabeceraInv?:number;
    fechaApertura?:Date;

    //!
    proximoNroComprobante?:number;

}

//para agregar productos a la tabla de recepciones
export interface ProdRecibido{
    idProducto:number;
    nombre:string;
    cantidad:number;
}

//datos enviados para registrar el listado de recepciones
export interface GuardarRecepcion{
    nroComprobante:string;
    observacion:string;
    productos: ProdRecibido[];
}

//para visualizar las recepciones

export interface RecepcionVisualizar{
    idcrecepcion:number;
    idproducto:number;
    cantidad:number;
    precio:number;
    total:number;
    Crecepcion:{fecha:Date};
    Producto:{
        nombre:string;
        idproducto:number;
    }
    
}

export interface RespuestaRecepcionesVisualizar{
    dRecepcion:RecepcionVisualizar[];
}

export interface RespuestaDatosVisualizarRecepcion{
    mostrar: boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
    drecepcion?:RecepcionVisualizar[];
}


