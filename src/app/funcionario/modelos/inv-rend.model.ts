
//!PARA CABECERA DE INVENTARIO
export interface invCabHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?: Date;
}

export interface Sucursal {
    idSucursal:number;
    nombre:string;    
    //los demas datos no son necesarios
}

export interface RespuestaSucursal{
    sucursal:Sucursal
}

export interface RespuestaDatosCab {
    mostrar: boolean;
    descripcion:string;
    sucursal?: Sucursal;
    idCabeceraInv?:number;
    fechaApertura?: Date;
}

export interface guardarCabecera{
    observacion:string;
}

//!PARA INVENTARIO DE PRODUCTOS
export interface invProdHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
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

export interface RespuestaDatosProducto {
    mostrar: boolean;
    descripcion:string;
    productos?: Producto[];
    idCabeceraInv?:number;
    fechaApertura?:Date;
}

/*
usar una interfaz que utilice la notación de corchetes para definir propiedades con 
nombres de llaves dinámicas. Dado que no puedes predefinir todas las llaves de antemano, 
tendrás que usar una notación de índice genérica
*/
export interface GuardarInventario{
    productos:{[key: number]: number;}
}

//!PARA RENDICION DE CAJA 
export interface rendCajaHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
}

export interface Dinero {
    idBillete:number;
    nombreBillete:string; 
    monto:number;   
}

//para listar dineros
export interface RespuestaDineros{
    total:number,
    dinero: Dinero[]
}

export interface RespuestaDatosDinero {
    mostrar: boolean;
    descripcion:string;
    dineros?: Dinero[];
    idCabeceraInv?:number;
    fechaApertura?:Date;
}

export interface datosGuardarBillete {
    idBillete:number;
    cantidad:number;
    observacion:string;
}

export interface GuardarRendicion{
    dineroControles:datosGuardarBillete[];
}

//para obtener informacion del producto al presionar enter en el campo id producto de recepcion y salida

export interface RespuestaProducto{
    nombre: string;
}

//para visualizar los inventarios ya enviados o registrados
//para visualizar las recepciones

export interface InventarioVisualizar{
    idcrecepcion:number;
    idproducto:number;
    cantidad:number;
    total:number;
    Producto:{
        nombre:string;
    }
}

export interface RespuestaInventariosVisualizar{
    dInventario:InventarioVisualizar[];
}

export interface RespuestaDatosVisualizarInventario{
    mostrar: boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
    dinventario?:InventarioVisualizar[];
}

//para visualizar el detalle de inventario 
export interface DetInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    cantidadTotal:number; // para inventarios cerrados
    totalMultiplicado:number; // para inventarios cerrados
    Producto:{
        nombre:String;
    }
}

export interface RespuestaDetInventarioVisualizar{
    dInventario:DetInventario[];
}

export interface RespuestaDatosVisualizarInv{
    mostrar: boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;
    dinventario?:DetInventario[];
}
