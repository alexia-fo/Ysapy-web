import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { DatosFiltro, RespuestaCabecera, RespuestaCalculosRendicion, RespuestaDetInventario, RespuestaDetRecepcion, RespuestaDetSalida, RespuestaDetallesRendicion } from '../modelos/ver-calculos-rendicion';
import { UsuarioService } from './usuario.service';
import { SucursalService } from './sucursal.service';

@Injectable({
  providedIn: 'root'
})
export class VerCalculosRendicionService {
  //ruta
  private apiUrl = `${environment.API_URL}/api`;

  //para enviar parametros de filtrado de los get's
  params = {};

  constructor(
    private http: HttpClient,
    private errorS: ManejarErrorService,
    private servicioU: UsuarioService,
    private servicioS: SucursalService
  ) { }

  obtenerDetallesRendicion(idCabecera:number): Observable<RespuestaDetallesRendicion> {

    return this.http.get<RespuestaDetallesRendicion>(`${this.apiUrl}/calculosRendicion/obtenerDetalleRendicion`, {
      params: {idCabecera}
    })
      .pipe(
        catchError(this.errorS.handleError)
      );

  }

  obtenerCalculoRendicion(idCabecera:number): Observable<RespuestaCalculosRendicion> {

    return this.http.get<RespuestaCalculosRendicion>(`${this.apiUrl}/calculosRendicion/obtenerCalculoRendicion`, {
      params: {idCabecera}
    })
      .pipe(
        catchError(this.errorS.handleError)
      );

  }

  // obtenerCabeceras(desde: Date, limite:Date): Observable<RespuestaCabecera> {
  //   this.params={
  //     desde,
  //     limite
  //   }

  //   return this.http.get<RespuestaCabecera>(`${this.apiUrl}/calculosRendicion/obtenerCabecerasInventario`, {
  //     params:this.params
  //   })
  //     .pipe(
  //       catchError(this.errorS.handleError)
  //     );
  // }
    obtenerCabeceras(data:DatosFiltro): Observable<RespuestaCabecera> {
    this.params=data;

    return this.http.get<RespuestaCabecera>(`${this.apiUrl}/calculosRendicion/obtenerCabecerasInventario`, {
      params:this.params
    })
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  obtenerDetalleInventario(idCabecera:number): Observable<RespuestaDetInventario> {

    return this.http.get<RespuestaDetInventario>(`${this.apiUrl}/calculosRendicion/obtenerDetalleInventario/${idCabecera}`)
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  obtenerDetalleRecepcion(idCabecera:number, idProducto:number): Observable<RespuestaDetRecepcion> {
    this.params={
      idCabecera,
      idProducto
    }

    return this.http.get<RespuestaDetRecepcion>(`${this.apiUrl}/calculosRendicion/obtenerDetalleRecepcion`, {
      params:this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  obtenerDetalleSalida(idCabecera:number, idProducto:number): Observable<RespuestaDetSalida> {
    this.params={
      idCabecera,
      idProducto
    }


    return this.http.get<RespuestaDetSalida>(`${this.apiUrl}/calculosRendicion/obtenerDetalleSalida`, {
      params:this.params
    })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  //////////////// PDF ///////////

  obtenerCabecerasPDF(): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiUrl}/pdf/pdfCabecerasInventario`, { headers, responseType: 'blob' });
  }

}


