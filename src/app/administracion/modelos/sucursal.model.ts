
import { Usuario, datoUsuario } from "./usuario.model";

//-----inicio sucursal-------

export interface Sucursal {
    idSucursal:number;
    nombre:string;    
    idusuario:number,
    estado:boolean,
    createdAt:Date;
    updateAt:Date;
    Usuario:datoUsuario
}

export interface RespuestaSucursales{
    total:number,
    sucursal:Sucursal[]
}

export interface RespuestaSucursal{
    sucursal:Sucursal
}

export interface GuardarSucursal extends Omit<Sucursal, 'idsucursal' | 'idusuario' | 'activo' | 'Usuario'>{
    /*
    nombre
    */
}

//datos de la clasificacion a actualizar
export interface ActualizarSucursal extends Omit<Sucursal, 'idsucursal' | 'idusuario' | 'activo' | 'Usuario'>{
    /*
    nombre
    */
}

export interface EliminadoSucursal{
    sucursal:Sucursal,
    usuarioAutenticado:Usuario
}

//-----fin sucursal-------
export interface datoSucursal{
    nombre:string;
}