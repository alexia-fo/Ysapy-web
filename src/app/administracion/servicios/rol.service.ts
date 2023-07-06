import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RespuestaRoles, Rol } from '../modelos/rol.model';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = `${environment.API_URL}/api/roles`;

  params: any = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService
  ) { }
  obtenerRoles(limite: number = -1, desde: number = -1, activo: number = -1, tipo: '' | 'F' | 'C' = ''): Observable<RespuestaRoles> {

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

    if (tipo != '') {
      this.params.tipo = tipo;
    }

    return this.http.get<RespuestaRoles>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

}
