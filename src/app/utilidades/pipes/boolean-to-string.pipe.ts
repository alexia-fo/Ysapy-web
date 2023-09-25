import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToString'
})
export class BooleanToStringPipe implements PipeTransform {
//! Se utiliza para listar datos en tablas del modulo Administracion
/*
El propósito de este filtro es transformar este valor booleano en una cadena de texto que representa si algo está "Sí" o "No".

Si el valor booleano (value) es true, se retorna la cadena 'Sí'.

Si el valor booleano (value) es false, se retorna la cadena 'No'.
*/
  transform(value: boolean): unknown {
    if(value){
      return 'Sí'
    }
    return 'No';
  }

}
