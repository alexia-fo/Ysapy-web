import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, tap, map, of } from 'rxjs';
import { GuardarRecepcion, ProdRecibido, RespuestaDatos, recCabHabilitado } from '../modelos/recepcion-productos.model';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { RespuestaProductos } from '../modelos/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class RecepcionProductosService {
//ruta
// private apiUrl = `${environment.API_URL}/api/recepciones`;
private apiUrl = `${environment.API_URL}/api`;

constructor(
  private http: HttpClient,
  private errorS:ManejarErrorService,
  private autService:AutentificacionService
) { }

 //PARA ALMACENAR LOS DATOS DE MANERA TEMPORAL
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
//FIN DE METODOS PARA ALMACENAR DATOS DE MANERA LOCAL

//TODO:AHORA SE UTILIZARA EL MISMO END POINT DE INVENTARIOS

// productosRecepcion(): Observable<RespuestaProductos> {
//   return this.http.get<RespuestaProductos>(`${this.apiUrl}/productosRecepcion`)
//   .pipe(
//     catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
//     );
// }

verExiteApertura(): Observable<recCabHabilitado> {
  return this.http.get<recCabHabilitado>(`${this.apiUrl}/recepciones/verExisteApertura`)
  .pipe(
    tap((response)=>{
      console.log("------- ", response)
    }),
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
} 

productosRecepcion(): Observable<RespuestaProductos> {
  return this.http.get<RespuestaProductos>(`${this.apiUrl}/inventarios/productosInventario`)
  .pipe(
    tap((response)=>{
      console.log("------- ", response)
    }),
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
}

//Si ya existe una detalle de inventario, se obtienen los productos registrados
obtenerDatos(): Observable<RespuestaDatos> {
  return this.verExiteApertura().pipe(
    switchMap((respuesta: recCabHabilitado): Observable<RespuestaDatos> => {
      if (respuesta.habilitado) {
        return this.productosRecepcion().pipe(
          tap((respuestaProductos: RespuestaProductos)=>{
            console.log("-------")
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

registrarRecepcion(recepcion: GuardarRecepcion): Observable<respuestaMensaje> {
  return this.http.post<respuestaMensaje>(`${this.apiUrl}/recepciones/registrarRecepcion`, { ...recepcion })
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
}


}
