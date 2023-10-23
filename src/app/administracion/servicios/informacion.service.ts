import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { ActualizarInformacion, EliminadoInformaicion, GuardarInformacion, Informacion, RespuestaInformaciones } from '../modelos/informacion.model';
@Injectable({
  providedIn: 'root'
})
export class InformacionService {
 //ruta
 private apiUrl = `${environment.API_URL}/api/informaciones`;

 //para enviar parametros de filtrado de los get's

 params = {};

 constructor(
   private http: HttpClient,
   private errorS:ManejarErrorService
 ) { }

 crear(informacion: GuardarInformacion): Observable<Informacion> {
   return this.http.post<Informacion>(`${this.apiUrl}`, { ...informacion })
     .pipe(
       catchError(this.errorS.handleError)
     );
 }

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

 actualizar(id: number, informacion: ActualizarInformacion): Observable<Informacion> {
   return this.http.put<Informacion>(`${this.apiUrl}/${id}`, { ...informacion })
     .pipe(
       catchError(this.errorS.handleError)
     );
 }

 eliminar(id: number): Observable<EliminadoInformaicion> {
   return this.http.delete<EliminadoInformaicion>(`${this.apiUrl}/${id}`)
     .pipe(
       catchError(this.errorS.handleError)
     )
 }

}
