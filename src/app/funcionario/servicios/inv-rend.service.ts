import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { RespuestaDatosCab, RespuestaDatosDinero, RespuestaDatosProducto, RespuestaDineros, RespuestaProductos, RespuestaSucursal, invCabHabilitado, invProdHabilitado, rendCajaHabilitado } from '../modelos/inventario.model';
import { Observable, catchError, switchMap, tap, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvRendService {
  //ruta
  private apiUrl = `${environment.API_URL}/api`;

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  //////////// ----- CABECERA ---- ///////////

  verExiteApertura(): Observable<invCabHabilitado> {
    return this.http.get<invCabHabilitado>(`${this.apiUrl}/inventarios/verExisteApertura`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  } 

  obtenerSucDeUsuario(): Observable<RespuestaSucursal> {
    return this.http.get<RespuestaSucursal>(`${this.apiUrl}/inventarios/sucDeUsuario`)
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  //verifica si la apertura se encuentra disponible, si esta disponible obtiene el la Sucursal de usuario
  obtenerDatosCabecera(): Observable<RespuestaDatosCab> {
    return this.verExiteApertura().pipe(
      switchMap((respuesta: invCabHabilitado): Observable<RespuestaDatosCab> => {
        if (respuesta.habilitado) {
          return this.obtenerSucDeUsuario().pipe(
            //map((respuestaProductos: RespuestaProductos): RespuestaDatosProducto => ({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto })),
            tap((respuestaSucursal: RespuestaSucursal)=>{
              console.log({ mostrar: true, descripcion:respuesta.descripcion ,sucursal: respuestaSucursal })
            }),
            map((RespuestaSucursal: RespuestaSucursal): RespuestaDatosCab => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,sucursal: RespuestaSucursal.sucursal })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
    );
  }  

  //inserta una nueva cabecera de inventario y rendicion
  crearApertura(datos: any): Observable<any> {
    console.log(datos)
    return this.http.post<any>(`${this.apiUrl}/inventarios/crearApertura`, { ...datos })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  ///////// ----- INVENTARIO DE PRODUCTOS ------ /////////////

  verificarInventario():Observable<invProdHabilitado>{
    return this.http.get<invProdHabilitado>(`${this.apiUrl}/inventarios/verificarInventario`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }
  productosInventario(): Observable<RespuestaProductos> {
    return this.http.get<RespuestaProductos>(`${this.apiUrl}/inventarios/productosInventario`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
    }
  obtenerDatosProducto(): Observable<RespuestaDatosProducto> {
    return this.verificarInventario().pipe(
      switchMap((respuesta: invProdHabilitado): Observable<RespuestaDatosProducto> => {
        console.log('invHabilitado: ', respuesta)
        if (respuesta.habilitado) {
          return this.productosInventario().pipe(
            //map((respuestaProductos: RespuestaProductos): RespuestaDatosProducto => ({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto })),
            tap((respuestaProductos:RespuestaProductos)=>{
              console.log('obtenerProductos: ',respuestaProductos);
              console.log({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto })
            }),
            map((respuestaProductos: RespuestaProductos): RespuestaDatosProducto => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
    );
  }

  registrarInventario(inventario: any): Observable<any> {
    console.log(inventario)
    return this.http.post<any>(`${this.apiUrl}/inventarios/registrarInventario`, { ...inventario })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  ////////////// RENDICION CAJA ///////////////////

  verificarRendicion():Observable<rendCajaHabilitado>{
    return this.http.get<rendCajaHabilitado>(`${this.apiUrl}/inventarios/verificarRendicion`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  dinerosRendicion(): Observable<RespuestaDineros> {
    return this.http.get<RespuestaDineros>(`${this.apiUrl}/inventarios/dinerosRendicion`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  obtenerDatosDinero(): Observable<RespuestaDatosDinero> {
    return this.verificarRendicion().pipe(
      switchMap((respuesta: rendCajaHabilitado): Observable<RespuestaDatosDinero> => {
        if (respuesta.habilitado) {
          return this.dinerosRendicion().pipe(
            tap((respuestaDineros:RespuestaDineros)=>{
              console.log('obtenerProductos: ',respuestaDineros);
              console.log({ mostrar: true, descripcion:respuesta.descripcion ,dieneros: respuestaDineros.dinero })
            }),
            map((respuestaDineros: RespuestaDineros): RespuestaDatosDinero => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,dineros: respuestaDineros.dinero })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
    );
  }

  registrarRendicion(rendicion: any): Observable<any> {
    console.log(rendicion)
    return this.http.post<any>(`${this.apiUrl}/inventarios/registrarRendicion`, { ...rendicion })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }
}
