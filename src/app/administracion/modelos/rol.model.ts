
//-----inicio rol-------

//rol del usuario
export interface Rol {
    idRol:number;
    rol:string;  
    tipo:string;
    activo:number;  
}

//para listar roles de usuarios
export interface RespuestaRoles{
    total:number,
    rol:Rol[]
}

//-----fin rol-------

// PARA ACCEDER A LOS DATOS DE ROLES (CUANDO SON LLAVES FORANEAS) 
// para ver el nombre del rol al listar el usuarios en la tabla de usuarios

export interface datoRol{
    rol:string;
}