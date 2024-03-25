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

    categoria:string | null; //Los FUNCIONARIOS tienen categorioa A | C | F los administradores tienen null
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
    turno

    categoria
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
    turno

    categoria
    */
}

export interface EliminadoUsuario{
    usuario:Usuario,
    usuarioAutenticado:Usuario
}

//------ fin usuario ------

// PARA ACCEDER A LOS DATOS DE USUARIOS (QUE CORRESPONDEN A LLAVES FORANEAS) - Producto
//abmc-producto
export interface datoUsuario{
    nombre:string;
}

//para consultas anidadas en los servicios

//se usa para obtener los datos al mismo tiempo con switchMap
export interface RolSucursal{
    roles: Rol[];
    sucursales: Sucursal[] 
}

