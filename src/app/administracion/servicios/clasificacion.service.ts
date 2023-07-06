import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { RespuestaClasificaciones } from '../modelos/clasificacion.model';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {

  //ruta
  private apiUrl = `${environment.API_URL}/api/clasificaciones`;

  //para enviar parametros de filtrado de los get's
  params = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService
  ) { }

  obtenerClasificaciones(limite: number = -1, desde: number = -1, activo: number = -1): Observable<RespuestaClasificaciones> {

    if (limite != -1 && desde != -1) {

      if (activo != -1) {
        this.params = {
          limite,
          desde,
          activo
        }
      } else {
        this.params = {
          limite,
          desde
        }
      }
    }

    if (activo != -1) {
      this.params = {
        activo
      }
    }

    return this.http.get<RespuestaClasificaciones>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

}


