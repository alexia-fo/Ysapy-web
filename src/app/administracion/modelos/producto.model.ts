import { datoClasificacion } from "./clasificacion.model";
import { Usuario, datoUsuario } from "./usuario.model";

//-----inicio producto-------

//datos de un producto
export interface Producto {
    idProducto:number;
    nombre:string;
    descripcion:string;
    img:string;
    precio:number;
    facturable:boolean;
    activo:boolean;
    idclasificacion:number;
    idusuario:number;
    createdAt:Date;
    updateAt:Date;
    Usuario:datoUsuario;
    Clasificacion: datoClasificacion;
}

//para listar productos al administrador
export interface RespuestaProductos{
    total:number,
    producto:Producto[]
}

//para obtener los datos del producto a editar
export interface RespuestaProducto{
    producto:Producto
    clasificacion:datoClasificacion
}

//datos del producto a guardar
export interface GuardarProducto extends Omit<Producto, 'idProducto' | 'img' | 'facturable' | 'activo' | 'createAt' | 'updateAt' | 'Usuario' | 'Clasificacion'>{
/*
nombre
descripcion
precio
idclasificacion
*/
}

//datos del producto a actualizar
export interface ActualizarProducto extends Omit<Producto, 'idProducto' | 'img' | 'facturable' | 'activo' |  'createAt' | 'updateAt' | 'Usuario' | 'Clasificacion'>{
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

export interface datoProducto{
    nombre:string;
}