import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment';
import { RespuestaUnidades } from '../modelos/unidad.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  //ruta
  private apiUrl = `${environment.API_URL}/api/unidades`;

  //para enviar parametros de filtrado de los get's
  params = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService
  ) { }

  //para combo de abmc de productos en modulo administracion
  obtenerUnidades(limite: number = -1, desde: number = -1): Observable<RespuestaUnidades> {

    if (desde > 0  && limite > desde) {
      this.params = {
        limite,
        desde
      }
    }

    return this.http.get<RespuestaUnidades>(`${this.apiUrl}`, {
      params: this.params
    })
    .pipe(
      catchError(this.errorS.handleError)
    );
  }
}
