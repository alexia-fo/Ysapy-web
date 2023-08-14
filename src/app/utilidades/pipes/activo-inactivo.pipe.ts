import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activoInactivo'
})
export class ActivoInactivoPipe implements PipeTransform {

  transform(value: boolean): unknown {
    if(value){
      return ''
    }
    return 'Inactivo';
  }

}
