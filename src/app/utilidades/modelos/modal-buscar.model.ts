//la tabla se reconstruye mediante ngIf del loading por lo que no es necesario idTabla 
//para destruirlo, no tiene eventos, pero esto conlleva a que solo se pueda construir una tabla en un mismo componente
export interface TablaItem<T> {//para modal buscar y tabla basica
    campos:string[];
    propiedades: string[];
    datos: T[];
}

//para listado en tablas con paginado 
//! VOVER A VERIFICAR CREO QUE NO SE UTILIZA (NO SE PUEDE DESTRUIR LA TABLA POR ID)
export interface TablaItemPag<T> {//para modal buscar
    campos:string[];
    propiedades: string[];
    datos: T[];
    tablaId:string;//para destruir solo una tabla cuando hay varias en un mismo componente con el ngOnDestroy
}

//PARA PRUEBA DE TABLAS CON PIPE
export interface TablaItemPipe<T> {//para modal buscar y tabla basica
    campos:string[];
    propiedades: definicionColumnas[];
    datos: T[];
}

export interface definicionColumnas{
    campo:string;
    pipe?:any;
}