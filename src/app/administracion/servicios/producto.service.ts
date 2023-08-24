import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActualizarProducto, EliminadoProducto, GuardarProducto, Producto, RespuestaProductos } from './../modelos/producto.model';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //ruta
  private apiUrl = `${environment.API_URL}/api/productos`;

  //para enviar parametros de filtrado de los get's

  params = {};

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  //para validaciones asincronas de nombre de productos
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
    return this.http.post<Producto>(`${this.apiUrl}`, { ...producto })
      .pipe(
        catchError(this.errorS.handleError)
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
        catchError(this.errorS.handleError)
      );
  }

  actualizar(id: number, producto: ActualizarProducto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, { ...producto })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  eliminar(id: number): Observable<EliminadoProducto> {
    return this.http.delete<EliminadoProducto>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.errorS.handleError)
      )
  }

}
