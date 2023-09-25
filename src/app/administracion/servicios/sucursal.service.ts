import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { RespuestaSucursales, Sucursal, EliminadoSucursal, ActualizarSucursal, GuardarSucursal } from '../modelos/sucursal.model';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  //ruta
  private apiUrl = `${environment.API_URL}/api/sucursales`;

  params = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService
  ) { }

  crear(sucursal: GuardarSucursal): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}`, { ...sucursal })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }

  //listar en tabla de abmc de sucursales
  //para listar sucursales en combo al crear o modificar usuario
  //para listar sucursales en la ventana de filtro del listado de cabeceras de inventario
  obtenerSucursales(limite: number = -1, desde: number = -1): Observable<RespuestaSucursales> {

    if (desde > 0 && limite > desde) {
      this.params = {
        limite,
        desde
      }
    }

    return this.http.get<RespuestaSucursales>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  actualizar(id: number, sucursal: ActualizarSucursal): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.apiUrl}/${id}`, { ...sucursal })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  eliminar(id: number): Observable<EliminadoSucursal> {
    return this.http.delete<EliminadoSucursal>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.errorS.handleError)
      )
  }

}
