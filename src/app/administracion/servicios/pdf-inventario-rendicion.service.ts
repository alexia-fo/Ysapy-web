import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PdfInventarioRendicionService {

  private apiUrl=`${environment.API_URL}/api/pdf`;
  constructor(
    private http:HttpClient,
    private errorS:ManejarErrorService
  ) { }

  obtenerCabeceras(): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiUrl}/cabeceras`, { headers, responseType: 'blob' });
  }

  // obtenerClasificaciones(limite: number = -1, desde: number = -1, activo: number = -1): Observable<RespuestaClasificaciones> {

  //   if (limite != -1 && desde != -1) {

  //     if (activo != -1) {
  //       this.params = {
  //         limite,
  //         desde,
  //         activo
  //       }
  //     } else {
  //       this.params = {
  //         limite,
  //         desde
  //       }
  //     }
  //   }

  //   if (activo != -1) {
  //     this.params = {
  //       activo
  //     }
  //   }

  //   return this.http.get<RespuestaClasificaciones>(`${this.apiUrl}`, {
  //     params: this.params
  //   })
  //     .pipe(
  //       catchError(this.errorS.handleError)
  //     );
  // }

}
