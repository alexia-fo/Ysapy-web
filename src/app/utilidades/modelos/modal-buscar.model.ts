//la tabla se reconstruye mediante ngIf del loading por lo que no es necesario idTabla 
//para destruirlo, no tiene eventos, pero esto conlleva a que solo se pueda construir una tabla en un mismo componente
export interface TablaItem<T> {//para modal buscar y tabla basica
    campos:string[];
    propiedades: string[];
    datos: T[];
}

//para listado en tablas con paginado
export interface TablaItemPag<T> {//para modal buscar
    campos:string[];
    propiedades: string[];
    datos: T[];
    tablaId:string;//para destruir solo una tabla cuando hay varias en un mismo componente con el ngOnDestroy
}