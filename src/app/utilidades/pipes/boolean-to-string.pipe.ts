import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToString'
})
export class BooleanToStringPipe implements PipeTransform {

  transform(value: boolean): unknown {
    if(value){
      return 'Sí'
    }
    return 'No';
  }

}
