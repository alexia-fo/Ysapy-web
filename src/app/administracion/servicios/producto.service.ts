import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { ActualizarProducto, DatosProductos, EliminadoProducto, GuardarProducto, Producto, RespuestaProductos } from './../modelos/producto.model';
import { RespuestaMarcas } from '../modelos/marca.model';
import { RespuestaUnidades } from '../modelos/unidad.model';
import { RespuestaClasificaciones } from '../modelos/clasificacion.model';

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
        // catchError((response: HttpErrorResponse) => {
        //   return throwError(() => new Error(response.error.msg))
        // })
        catchError(this.errorS.handleError)
      );
  }

  crear(producto: GuardarProducto): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}`, { ...producto })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  obtenerProductos(limite: number = -1, desde: number = -1): Observable<RespuestaProductos> {

    if (desde > 0  && limite > desde) {

      this.params = {
        limite,
        desde
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

  obtenerDatos(): Observable<DatosProductos> {
    const marcas$ = this.http.get<RespuestaMarcas>(`${environment.API_URL}/api/marcas`);
    const unidades$ = this.http.get<RespuestaUnidades>(`${environment.API_URL}/api/unidades`);
    const clasificaciones$ = this.http.get<RespuestaClasificaciones>(`${environment.API_URL}/api/clasificaciones`);

    return forkJoin({ marcas: marcas$, unidades: unidades$, clasificaciones: clasificaciones$ }).pipe(
      catchError(this.errorS.handleError)
    );
  }
}


