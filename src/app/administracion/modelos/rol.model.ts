
//-----inicio rol-------

//rol del usuario
export interface Rol {
    idRol:number;
    rol:string;  
    activo:number;  
}

//para listar roles de usuarios
export interface RespuestaRoles{
    total:number,
    rol:Rol[]
}

//-----fin rol-------
export interface datoRol{
    rol:string;
}