import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, tap, map, of, forkJoin } from 'rxjs';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { RespuestaDatos, RespuestaProductos, RespuestaSalidas, salidaCabHabilitado } from '../modelos/salida-productos.model';
import { ProdRecibido } from '../modelos/recepcion-productos.model';

@Injectable({
  providedIn: 'root'
})
export class SalidaProductosService {
  //ruta
private apiUrl = `${environment.API_URL}/api/salidas`;

constructor(
  private http: HttpClient,
  private errorS:ManejarErrorService,
  private autService:AutentificacionService
) { }


///////////para almacenar los datos de manera temporal//////////
  // Obtener datos del localStorage
  getItems() {
    const storedData = localStorage.getItem('productosBaja');
    if (storedData) {
      const { fecha, items, observacion, uId } = JSON.parse(storedData);
      // Comprobar si la fecha almacenada coincide con la fecha actual
      const storedDate = new Date(fecha);
      const currentDate = new Date();
      if (storedDate.toDateString() === currentDate.toDateString() && uId==this.autService.usuario.idUsuario) {
        return {items, observacion};
      }
    }
    return {};
  }
  
  // Guardar datos en el localStorage
  saveItems(items:ProdRecibido[], observacion:string='') {
    const currentDate = new Date().toISOString(); // Obtener la fecha actual en formato ISO
    const data = {
      fecha: currentDate,
      items: items,
      observacion,
      uId:this.autService.usuario.idUsuario//si inicia sesion con otra cuenta no va a retornar
    };
    localStorage.setItem('productosBaja', JSON.stringify(data));
  }

  removerItems() {
    localStorage.removeItem('productosBaja');
  }
  
//////////////////////

verExiteApertura(): Observable<salidaCabHabilitado> {
  return this.http.get<salidaCabHabilitado>(`${this.apiUrl}/verExisteApertura`)
  .pipe(
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
} 

productosRecepcion(): Observable<RespuestaProductos> {
  return this.http.get<RespuestaProductos>(`${this.apiUrl}/productosSalida`)
  .pipe(
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
}

tiposSalida(): Observable<RespuestaSalidas> {
  return this.http.get<RespuestaSalidas>(`${this.apiUrl}/tiposSalida`)
  .pipe(
    catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
}

obtenerDatos(): Observable<RespuestaDatos> {
  return this.verExiteApertura().pipe(
    
    switchMap((respuesta: salidaCabHabilitado): Observable<RespuestaDatos> => {
      if (respuesta.habilitado) {
        return forkJoin([
          this.productosRecepcion(),
          this.tiposSalida()
        ]).pipe(
          map((Respuestas: [RespuestaProductos, RespuestaSalidas]): RespuestaDatos => {
            return ({ mostrar: true, descripcion:respuesta.descripcion ,producto: Respuestas[0].producto, salida:Respuestas[1].salida })
          })

        );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
      );
    }
//PETICIONES EN SERIE: switchMap
//PETICIONES EN PARALELO: forkJoin
/*
map te funciona para manipular la respuesta del observable y transformarlo en otro valor diferente y lo que estas necesitando en este punto es transformar el observable a otro, por lo cual el operador que necesitas es switchMap
*/
//https://www.google.com/search?q=como+puedo+realizar+dos+peticiones+al+mismo+tiempo+en+angular&rlz=1C1UUXU_esPY951PY951&oq=como+puedo+realizar+dos+peticiones+al+mismo+tiempo+en+angular&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhA0gEONTIyNTg1MDQ5ajBqMTWoAgCwAgA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:85852525,vid:duxgN9RXO2I
//https://adrianub.dev/blog/combinando-multiples-flujos-http-con-rxjs-observables-en-angular/

registrarRecepcion(recepcion: any): Observable<any> {
  console.log(recepcion)
  return this.http.post<any>(`${this.apiUrl}/registrarSalida`, { ...recepcion })
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
  );
}




}
