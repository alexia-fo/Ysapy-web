import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { errorCampo } from '../../modelos/errores.model';



@Injectable({
  providedIn: 'root'
})
export class ManejarErrorService {

  constructor() { }
  
  //!se utiliza para el manejo de errores tanto en el modulo administracion, funcionario..
  /*
    Se declara una variable errorMessage que se utilizará para almacenar los mensajes de error.

    Se verifica el código de estado de la respuesta HTTP utilizando error.status. Si el código de estado es igual a 400, 
    esto significa que la respuesta contiene errores de validación de campos, y se debe procesar de manera diferente.

    Si el código de estado es igual a 400, se asume que la respuesta contiene un arreglo de errores (relacionados con la validación de campos). 
    Se utiliza error.error.errors para acceder a ese arreglo de errores. La función map se utiliza para extraer el mensaje de cada error y se 
    almacenan en el arreglo errorMessage.

    Si el código de estado no es igual a 400, se asume que la respuesta contiene un solo mensaje de error. En este caso, se accede al mensaje de 
    error único utilizando error.error.msg, y se almacena en el arreglo errorMessage. Se utiliza para manejar errores que no están relacionados 
    con la validación de campos, como errores de servidor.

    Se utiliza throwError para crear un observable que emite el arreglo de mensajes de error (errorMessage) como un error. 
    La función throwError toma una función como argumento, que devuelve errorMessage. 
    Esto convierte errorMessage en un error observable que puede ser manejado por el código que realizó la solicitud HTTP.
  */
  
  handleError(error: HttpErrorResponse) {
    // console.log(error)
    let errorMessage: string[];
    if (error.status === 400) {
      errorMessage = error.error.errors.map((err:errorCampo) => err.msg);
    } else {
      errorMessage = [error.error.msg];
    }
    /*
    En este caso, estamos devolviendo throwError(errorMessage) directamente, lo que significa que errorMessage, que es un arreglo de mensajes de error, 
    se convierte en el error que se emite en el observable.
    */
   /* TODO: Otra forma de devolver un objeto Error que cotienen el mensaje determinado segun el codigo
    return throwError(() => new Error(response.error.msg))
   */
    return throwError(() => errorMessage);
  }

}
