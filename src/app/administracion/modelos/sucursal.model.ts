
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

export interface GuardarSucursal extends Omit<Sucursal, 'idsucursal' | 'idusuario' | 'estado' | 'Usuario' | 'createdAt' | 'updatedAt'>{
    /*
    nombre
    */
}

//datos de la clasificacion a actualizar
export interface ActualizarSucursal extends Omit<Sucursal, 'idsucursal' | 'idusuario' | 'estado' | 'Usuario'  | 'createdAt' | 'updatedAt'>{
    /*
    nombre
    */
}

export interface EliminadoSucursal{
    sucursal:Sucursal,
    usuarioAutenticado:Usuario
}

//-----fin sucursal-------

// PARA ACCEDER A LOS DATOS DE SUCURSALES (CUANDO SON LLAVES FORANEAS) 
// para ver el nombre de la sucursal al listar el usuarios en la tabla de usuarios,sucursales de inventarios

export interface datoSucursal{
    nombre:string;
}