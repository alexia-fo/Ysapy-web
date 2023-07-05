import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { errorCampo } from '../../modelos/errores.model';



@Injectable({
  providedIn: 'root'
})
export class ManejarErrorService {

  constructor() { }
  
  handleError(error: HttpErrorResponse) {
    let errorMessage: string[];
    if (error.status === 400) { // para validacion de campos pq devuelven un array de errores
      errorMessage = error.error.errors.map((err:errorCampo) => err.msg);
    } else {// resto de los codigos se usarán para para errores de que contengan un solo mensaje
      errorMessage = [error.error.msg];
    }
    return throwError(() => errorMessage);
  }
}
