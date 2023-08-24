import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
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

  //para abmc de productos en modulo administracion
  obtenerClasificaciones(limite: number = -1, desde: number = -1): Observable<RespuestaClasificaciones> {

    if (desde > 0  && limite > desde) {
      this.params = {
        limite,
        desde
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


