import { RespuestaClasificaciones, datoClasificacion } from "./clasificacion.model";
import { RespuestaMarcas } from "./marca.model";
import { RespuestaUnidades, Unidad } from "./unidad.model";
import { Usuario, datoUsuario } from "./usuario.model";

//-----inicio producto-------

//datos de un productos
export interface Producto {
    idProducto:number;
    idclasificacion:number;
    nombre:string;
    descripcion:string;
    img:string;
    precio:number;
    facturable:boolean;
    idusuario:number;
    createdAt:Date;
    updateAt:Date;
    activo:boolean;
    Usuario:datoUsuario;
    Clasificacion: datoClasificacion;

    //ADD
    idmarca:number;
    idunidad:number;
}

//para listar productos en modulo administracion
export interface RespuestaProductos{
    total:number,
    producto:Producto[]
}

//datos del producto a guardar
export interface GuardarProducto extends Omit<Producto,'idusuario' | 'idProducto' | 'img' | 'facturable' | 'activo' | 'createAt' | 'updateAt' | 'Usuario' | 'Clasificacion'>{
/*
nombre
descripcion
precio
idclasificacion
*/
}

//datos del producto a actualizar
export interface ActualizarProducto extends Omit<Producto,'idusuario' |  'idProducto' | 'img' | 'activo' |  'createAt' | 'updateAt' | 'Usuario' | 'Clasificacion'>{
    /*
    nombre
    descripcion
    precio
    idclasificacion
    facturable
    */
}

export interface EliminadoProducto{
    producto:Producto,
    usuarioAutenticado:Usuario
}

//-----fin producto-------

// PARA ACCEDER A LOS DATOS DE PRODUCTOS (CUANDO SON LLAVES FORANEAS) 
// para ver el nombre del producto al listar el producto en la tabla de inventarios

export interface datoProducto{
    nombre:string;
}

//para obtener todos los datos de combos para el alta y modificacion de una sola vez
export interface DatosProductos{
    unidades:RespuestaUnidades,
    marcas:RespuestaMarcas,
    clasificaciones:RespuestaClasificaciones
}