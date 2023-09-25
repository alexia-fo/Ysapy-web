import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activoInactivo'
})
export class ActivoInactivoPipe implements PipeTransform {
//! Se utiliza para listar datos en tablas del modulo Administracion
/*
El propósito de este filtro es transformar este valor booleano en una cadena de texto que representa si algo está "Activo" o "Inactivo".

Si el valor booleano (value) es true, se retorna la cadena 'Activo'.

Si el valor booleano (value) es false, se retorna la cadena 'Inactivo'.
*/
  transform(value: boolean): unknown {
    if(value){
      return 'Activo'
    }
    return 'Inactivo';
  }

}
