export interface Usuario{
    idUsuario: string;
    nombre: string; 
    nusuario: string; 
    correo: string; 
    contra: string;
    activo: boolean,
    img: string,
    google: boolean,
    idSucursal:string;
    idRol: string,
    turno:string;
    createdAt: Date,
    updatedAt: Date
}

export interface datosRol{
    rol:string;
}

export interface datosSucursal{
    nombre:string;
}

export interface Perfil extends Usuario{
    Rol:datosRol;
    Sucursal:datosSucursal;
}

export interface RespuestaAutentificacion{
    usuario:Usuario,
    token:string
}

export interface RespuestaPerfil{
    usuario:Perfil;
}

