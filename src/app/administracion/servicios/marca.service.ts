import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment';
import { RespuestaMarcas } from '../modelos/marca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  //ruta
  private apiUrl = `${environment.API_URL}/api/marcas`;

  //para enviar parametros de filtrado de los get's
  params = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService
  ) { }

  //para combo de abmc de productos en modulo administracion
  obtenerMarcas(limite: number = -1, desde: number = -1): Observable<RespuestaMarcas> {

    if (desde > 0  && limite > desde) {
      this.params = {
        limite,
        desde
      }
    }

    return this.http.get<RespuestaMarcas>(`${this.apiUrl}`, {
      params: this.params
    })
    .pipe(
      catchError(this.errorS.handleError)
    );
  }
}
