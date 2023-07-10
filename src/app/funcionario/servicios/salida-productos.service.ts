import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, tap, map, of } from 'rxjs';
import { RespuestaDatos, RespuestaProductos, recCabHabilitado } from '../modelos/recepcion-productos.model';

@Injectable({
  providedIn: 'root'
})
export class SalidaProductosService {
  //ruta
  private apiUrl = `${environment.API_URL}/api/recepciones`;

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  verExiteApertura(): Observable<recCabHabilitado> {
    return this.http.get<recCabHabilitado>(`${this.apiUrl}/verExisteApertura`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  } 

  productosRecepcion(): Observable<RespuestaProductos> {
    return this.http.get<RespuestaProductos>(`${this.apiUrl}productosRecepcion`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }

  obtenerDatos(): Observable<RespuestaDatos> {
    return this.verExiteApertura().pipe(
      switchMap((respuesta: recCabHabilitado): Observable<RespuestaDatos> => {
        if (respuesta.habilitado) {
          return this.productosRecepcion().pipe(
            //map((respuestaProductos: RespuestaProductos): RespuestaDatosProducto => ({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto })),
            tap((respuestaProductos: RespuestaProductos)=>{
              console.log({ mostrar: true, descripcion:respuesta.descripcion ,producto: respuestaProductos })
            }),
            map((RespuestaPrs: RespuestaProductos): RespuestaDatos => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,producto: RespuestaPrs.producto })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
    );
  }

  registrarRecepcion(recepcion: any): Observable<any> {
    console.log(recepcion)
    return this.http.post<any>(`${this.apiUrl}/registrarRecepcion`, { ...recepcion })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

}
