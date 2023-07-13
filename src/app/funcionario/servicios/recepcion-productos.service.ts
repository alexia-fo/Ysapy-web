import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, tap, map, of } from 'rxjs';
import { ProdRecibido, RespuestaDatos, RespuestaProductos, recCabHabilitado } from '../modelos/recepcion-productos.model';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';

@Injectable({
  providedIn: 'root'
})
export class RecepcionProductosService {
//ruta
private apiUrl = `${environment.API_URL}/api/recepciones`;

constructor(
  private http: HttpClient,
  private errorS:ManejarErrorService,
  private autService:AutentificacionService
) { }


///////////para almacenar los datos de manera temporal//////////
  // Obtener datos del localStorage
  getItems() {
    const storedData = localStorage.getItem('productosRecepcion');
    if (storedData) {
      const { fecha, items, observacion, nroComprobante, uId } = JSON.parse(storedData);
      // Comprobar si la fecha almacenada coincide con la fecha actual
      const storedDate = new Date(fecha);
      const currentDate = new Date();
      if (storedDate.toDateString() === currentDate.toDateString() && uId==this.autService.usuario.idUsuario) {
        return {items, observacion, nroComprobante};
      }
    }
    return {};
  }
  
  // Guardar datos en el localStorage
  saveItems(items:ProdRecibido[], observacion:string='', nroComprobante: string='') {
    const currentDate = new Date().toISOString(); // Obtener la fecha actual en formato ISO
    const data = {
      fecha: currentDate,
      items: items,
      observacion,
      nroComprobante,
      uId:this.autService.usuario.idUsuario//si inicia sesion con otra cuenta no va a retornar
    };
    localStorage.setItem('productosRecepcion', JSON.stringify(data));
  }

  removerItems() {
    localStorage.removeItem('productosRecepcion');
  }
//////////////////////

verExiteApertura(): Observable<recCabHabilitado> {
  return this.http.get<recCabHabilitado>(`${this.apiUrl}/verExisteApertura`)
  .pipe(
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
} 

productosRecepcion(): Observable<RespuestaProductos> {
  return this.http.get<RespuestaProductos>(`${this.apiUrl}/productosRecepcion`)
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
            //console.log({ mostrar: true, descripcion:respuesta.descripcion ,producto: respuestaProductos })
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
