
//PARA CABECERA DE INVENTARIO
export interface invCabHabilitado{
    habilitado:boolean;
    descripcion:string;
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
}

export interface guardarCabecera{
    observacion:string;
}

//--crear apertura aun no tiene modelo--//

///PARA INVENTARIO DE PRODUCTOS
export interface invProdHabilitado{
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

export interface RespuestaDatosProducto {
    mostrar: boolean;
    descripcion:string;
    productos?: Producto[];
}

/*
usar una interfaz que utilice la notación de corchetes para definir propiedades con 
nombres de llaves dinámicas. Dado que no puedes predefinir todas las llaves de antemano, 
tendrás que usar una notación de índice genérica
*/
export interface GuardarInventario{
    [key: number]: number;
}

//registrar inventario aun no tiene modelo

//PARA RENDICION DE CAJA 
export interface rendCajaHabilitado{
    habilitado:boolean;
    descripcion:string;
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
}