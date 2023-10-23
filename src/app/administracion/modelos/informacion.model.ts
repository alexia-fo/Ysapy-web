import { Usuario, datoUsuario } from "./usuario.model";

//-----inicio producto-------

//datos de un informacion
export interface Informacion {
    idInformacion:number;
    titulo:string;
    descripcion:string;
    img:string;
    fecha:Date;
    activo:boolean;
    idusuario:number;
    Usuario:datoUsuario;
}

//para listar informaciones en modulo administracion
export interface RespuestaInformaciones{
    total:number,
    informacion:Informacion[]
}

//datos de la informacion a guardar
export interface GuardarInformacion extends Omit<Informacion,'idusuario' | 'idInformacion' | 'img' | 'activo' | 'Usuario' >{
/*
titulo
descripcion
fecha
*/
}

//datos del producto a actualizar
export interface ActualizarInformacion extends Omit<Informacion,'idusuario' |  'idProducto' | 'img' | 'activo' |  'createAt' | 'updateAt' | 'Usuario' | 'Clasificacion'>{
    /*
    titulo
    descripcion
    fecha
    */
}

export interface EliminadoInformaicion{
    informacion:Informacion,
    usuarioAutenticado:Usuario
}

//-----fin producto-------

