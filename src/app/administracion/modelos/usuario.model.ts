import { Rol, datoRol } from "./rol.model";
import { Sucursal, datoSucursal } from "./sucursal.model";

//------ inicio usuario
export interface Usuario{
    idUsuario:number;
    nombre:string;
    nusuario:string;
    correo:string;
    contra:string
    activo:boolean;
    img:string;
    google:boolean;
    createAt:Date;
    updateAt:Date;
    idRol:number;
    turno:string;
    Rol:datoRol;
    Sucursal:datoSucursal;
}

//para listar usuarios
export interface RespuestaUsuarios{
    total:number,
    usuarios:Usuario[]
}


export interface RespuestaUsuario{
    msg:string,
    result:Usuario
}


//crear usuario
export interface GuardarUsuario extends Omit<Usuario, 'idUsuario' | 'activo' | 'img' | 'google' | 'createAt' | 'updateAt'>{//| 'nivel'
    /*
    nombre
    nusuario
    contra
    correo
    tipo
    rol
    */
}

//actualizar usuario
export interface ActualizarUsuario extends Omit<Usuario, 'idUsuario' | 'activo' | 'img' | 'google' | 'createAt' | 'updateAt' >{//| 'nivel'
    /*
    nombre
    nusuario
    contra
    correo
    tipo
    rol
    */
}

export interface EliminadoUsuario{
    usuario:Usuario,
    usuarioAutenticado:Usuario
}

//------ fin usuario ------

//Se usa cuando se obtnien datos de usuarios que corresponden a un FK
export interface datoUsuario{
    nombre:string;
}

//se usa para obtener los datos al mismo tiempo con switchMap
export interface RolSucursal{
    roles: Rol[];
    sucursales: Sucursal[] 
}

