import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { RespuestaCabecera, RespuestaCalculosRendicion, RespuestaDetRecepcion, RespuestaDetSalida, DatosFiltro, RespuestaFiltros, RespuestaRendicion, RespuestaDetalleRendicion, RespuestaCalculos } from '../modelos/inventariosRegistrados';

@Injectable({
  providedIn: 'root'
})
export class InventariosRegistradosService {
 //ruta
 private apiUrl = `${environment.API_URL}/api`;

 //para enviar parametros de filtrado de los get's
 params = {};

 constructor(
   private http: HttpClient,
   private errorS: ManejarErrorService,
 ) { }

 obtenerCabeceras(data:DatosFiltro): Observable<RespuestaCabecera> {
   this.params=data;

   return this.http.get<RespuestaCabecera>(`${this.apiUrl}/inventariosRegistrados/obtenerCabecerasInventario`, {
     params:this.params
   })
   .pipe(
     catchError(this.errorS.handleError)
   );
 }

 
 obtenerCalculoRendicion(idCabecera:number): Observable<RespuestaCalculosRendicion> {

   return this.http.get<RespuestaCalculosRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerCalculoRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }

 obtenerRendicion(idCabecera:number): Observable<RespuestaRendicion> {

   return this.http.get<RespuestaRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
 }

  //FIXME:

 obtenerCalculos(idCabecera:number): Observable<RespuestaCalculos> {

   return this.http.get<RespuestaCalculos>(`${this.apiUrl}/inventariosRegistrados/obtenerCalculos/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }

 obtenerDetalleInventario(idCabecera:number): Observable<any> {

   return this.http.get<any>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleInventario/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );
 }

 obtenerDetalleRendicion(idCabecera:number): Observable<RespuestaDetalleRendicion> {

   return this.http.get<RespuestaDetalleRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }
 //FIXME:

 obtenerDetalleRecepcion(idCabecera:number, idProducto:number): Observable<RespuestaDetRecepcion> {
   this.params={
     idCabecera,
     idProducto
   }

   return this.http.get<RespuestaDetRecepcion>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleRecepcion`, {
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


   return this.http.get<RespuestaDetSalida>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleSalida`, {
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
