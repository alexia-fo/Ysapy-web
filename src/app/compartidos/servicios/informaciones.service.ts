import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { RespuestaInformaciones } from '../modelos/informaciones.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformacionesService {
 //ruta
 private apiUrl = `${environment.API_URL}/api/informaciones`;

 //para enviar parametros de filtrado de los get's

 params = {};

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  obtenerInformaciones(limite: number = -1, desde: number = -1): Observable<RespuestaInformaciones> {

    if (desde > 0  && limite > desde) {
 
      this.params = {
        limite,
        desde
      }
      
    }
    
    return this.http.get<RespuestaInformaciones>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }
}
