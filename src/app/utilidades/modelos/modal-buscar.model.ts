//! 1. tabla basica --> 2. tabla pipe --> 3. tabla boton y con alineacion
//!para componente modal-buscar y para componente tabla basica
export interface TablaItem<T> {
    campos:string[];//Encabezado de la tabla
    propiedades: string[];//propiedades del objeto
    datos: T[];//array de objetos
}

//!Para componente tabla-pipe y tabla-boton
export interface TablaItemPipe<T> {//para modal buscar y tabla basica
    campos:string[];
    propiedades: definicionColumnas[];
    datos: T[];
}
export interface definicionColumnas{
    campo:string;
    pipe?:any;
}


