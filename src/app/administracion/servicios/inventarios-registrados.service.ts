import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { RespuestaCabecera, RespuestaCalculosRendicion, RespuestaDetRecepcion, RespuestaDetSalida, DatosFiltro, RespuestaFiltros, RespuestaRendicion, RespuestaDetalleRendicion, RespuestaCalculos, RecepcionVisualizar, RespuestaRecepcionesVisualizar, RespuestaSalidasVisualiza } from '../modelos/inventariosRegistrados';

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

 obtenerRecepciones(idCabecera:number): Observable<RespuestaRecepcionesVisualizar> {
  this.params={
    idCabecera,
  }

  return this.http.get<RespuestaRecepcionesVisualizar>(`${this.apiUrl}/inventariosRegistrados/obtenerRecepciones`, {
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


 obtenerSalidas(idCabecera:number): Observable<RespuestaSalidasVisualiza> {
  this.params={
    idCabecera,
  }

  return this.http.get<RespuestaSalidasVisualiza>(`${this.apiUrl}/inventariosRegistrados/obtenerSalidas`, {
    params:this.params
  })
    .pipe(
      catchError(this.errorS.handleError)
    );
}

 //////////////// PDF ///////////

 obtenerDetalleInventarioPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerDetalleInventario/${idCabecera}`, { headers, responseType: 'blob' });
 }
 obtenerVentasPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerVentasInventario/${idCabecera}`, { headers, responseType: 'blob' });
 }
 obtenerDetalleRendicionPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerRendicion/${idCabecera}`, { headers, responseType: 'blob' });
 }

}
