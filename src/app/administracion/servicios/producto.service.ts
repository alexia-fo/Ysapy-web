import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActualizarProducto, EliminadoProducto, GuardarProducto, Producto, RespuestaProducto, RespuestaProductos } from './../modelos/producto.model';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.API_URL}/api/productos`;

  params = {};

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  ////PARA VALIDACIONES ASINCRONAS - POR AHORA NO SE USA
  productoHabilitado(nombre: string) {
    return this.http.get(`${this.apiUrl}`, {
      params: {
        nombre
      }
    })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })
      );
  }

  

  crear(producto: GuardarProducto): Observable<Producto> {
    console.log('servicio p ', producto)
    return this.http.post<Producto>(`${this.apiUrl}`, { ...producto })
      .pipe(
        /*
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })
        */
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }

  obtenerProductos(limite: number = -1, desde: number = -1, activo: number = -1): Observable<RespuestaProductos> {

    if (limite != -1 && desde != -1) {

      if (activo != -1 ) {
        this.params = {
          limite,
          desde,
          activo
        }
      }else{
        this.params = {
          limite,
          desde
        }
      }
    }

    if (activo != -1 ) {
      this.params = {
        activo
      }
    }
    
    return this.http.get<RespuestaProductos>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
        /*
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })*/
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas

      );
  }

  obtenerProducto(id: number): Observable<RespuestaProducto> {
    return this.http.get<RespuestaProducto>(`${this.apiUrl}/${id}`)
      .pipe(
        /*
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })*/
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }

  actualizar(id: number, producto: ActualizarProducto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, { ...producto })
      .pipe(
        /*
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })
        */
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }

  eliminar(id: number): Observable<EliminadoProducto> {
    return this.http.delete<EliminadoProducto>(`${this.apiUrl}/${id}`)
      .pipe(
        /*
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })
        */
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      )
  }

}
