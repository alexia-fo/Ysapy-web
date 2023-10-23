import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, tap, map, of, forkJoin } from 'rxjs';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { GuardarSalida, ProdEnBaja, RespuestaDatos, RespuestaDatosVisualizarSalida, RespuestaSalidas, RespuestaSalidasVisualizar, salidaCabHabilitado } from '../modelos/salida-productos.model';
import { ProdRecibido, recCabHabilitado } from '../modelos/recepcion-productos.model';
import { RespuestaProductos } from '../modelos/inv-rend.model';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Injectable({
  providedIn: 'root'
})
export class SalidaProductosService {
  //ruta
  private apiUrl = `${environment.API_URL}/api`;

constructor(
  private http: HttpClient,
  private errorS:ManejarErrorService,
  private autService:AutentificacionService
) { }

 //PARA ALMACENAR LOS DATOS DE MANERA TEMPORAL
  
  /*FIXME:
    const storedData = localStorage.getItem('productosBaja');: Esta línea de código intenta recuperar un valor almacenado en el objeto 
    localStorage bajo la clave 'productosBaja'. localStorage es un objeto en el navegador web que permite almacenar datos de forma 
    persistente en el navegador.

    if (storedData) {: Esta condición verifica si storedData tiene un valor distinto de null o undefined. En otras palabras, verifica si 
    hay datos almacenados bajo la clave 'productosBaja'.

    const { fecha, items, observacion, nroComprobante, uId } = JSON.parse(storedData);: Si hay datos almacenados, esta línea de código 
    deserializa el valor recuperado de localStorage (que es una cadena JSON) utilizando JSON.parse(). Luego, desestructura ese objeto JSON 
    en las variables fecha, items, observacion, y uId.

    if (storedDate.toDateString() === currentDate.toDateString() && uId == this.autService.usuario.idUsuario) {: Esta condición verifica dos cosas:

    Si la fecha almacenada es igual a la fecha actual. Esto se hace comparando las cadenas de texto generadas por toDateString() de ambas fechas. 
    Esto garantiza que los datos almacenados solo se devuelvan si fueron almacenados en el mismo día. Y Si el valor de uId coincide con el idUsuario 
    almacenado en propiedad de this.autService.usuario. Si se cumplen las condiciones anteriores, la función devuelve un objeto con las propiedades items y
    observacion. Estos son los datos almacenados bajo la clave 'productosBaja'.

    Si no se cumplen las condiciones en la condición if inicial o si no se encuentra ningún dato en localStorage, la función devuelve un objeto vacío {}.
  */
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
  
  /*FIXME: Guardar datos en el localStorage
    saveItems(items:ProdEnBaja[], observacion:string='') {: Esta línea define la función saveItems que toma tres parámetros:

    items: Un array de elementos de tipo ProdEnBaja.
    observacion: Una cadena de texto que representa observaciones relacionadas con los elementos recibidos. Es opcional y tiene un valor predeterminado de una cadena vacía ''.
    const currentDate = new Date().toISOString();: Esta línea crea una variable currentDate que almacena la fecha y hora actual en formato ISO .

    const data = { fecha: currentDate, items: items, observacion, nroComprobante, uId:this.autService.usuario.idUsuario };: Se crea un objeto llamado data que contiene los siguientes campos:

    fecha: Almacena la fecha y hora actual en formato ISO, como se obtuvo anteriormente.
    items: Almacena el array de elementos en baja pasado como argumento a la función.
    observacion: Almacena la observación (si se proporcionó como argumento) o una cadena vacía si no se proporcionó.
    uId: Almacena la identificación de usuario obtenida desde this.autService.usuario.idUsuario.Esta relacionado con la identificación del usuario que está utilizando la aplicación.
    localStorage.setItem('productosBaja', JSON.stringify(data));: Finalmente, se utiliza localStorage.setItem() para almacenar los datos del objeto data en el almacenamiento local del navegador 
    bajo la clave 'productosBaja'. Antes de almacenarlo, se convierte el objeto data en una cadena JSON utilizando JSON.stringify() para que pueda ser guardado en el localStorage
  */
  saveItems(items:ProdEnBaja[], observacion:string='') {
    const currentDate = new Date().toISOString(); // Obtener la fecha actual en formato ISO
    const data = {
      fecha: currentDate,
      items: items,
      observacion,
      uId:this.autService.usuario.idUsuario//si inicia sesion con otra cuenta no va a retornar
    };
    localStorage.setItem('productosBaja', JSON.stringify(data));
  }

  /*
    se utiliza para eliminar el elemento almacenado bajo la clave 'productosRecepcion' en el almacenamiento local del navegador. 
  */
  removerItems() {
    localStorage.removeItem('productosBaja');
  }
//FIN DE METODOS PARA ALMACENAR DATOS DE MANERA LOCAL  

//TODO:AHORA SE UTILIZARA EL MISMO END POINT DE INVENTARIOS
// productosRecepcion(): Observable<RespuestaProductos> {
//   return this.http.get<RespuestaProductos>(`${this.apiUrl}/productosSalida`)
//   .pipe(
//     catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
//     );
// }

//verifica si ya existe un detalle de inventario, ya que al registrar salidas se actualiza el campo cantidadRecepcion de la tabla dinventario
verExiteApertura(): Observable<salidaCabHabilitado> {
  return this.http.get<salidaCabHabilitado>(`${this.apiUrl}/salidas/verExisteApertura`)
  .pipe(
    catchError(this.errorS.handleError)
  );
} 

//obtener los productos registrados en la tabla productos utilizando el mismo endpoint para obtener los productos de inventario
productosSalida(): Observable<RespuestaProductos> {
  return this.http.get<RespuestaProductos>(`${this.apiUrl}/inventarios/productosInventario`)
  .pipe(
    catchError(this.errorS.handleError)
  );
}

//obtener los tipos de salida por las cuales puede generarse una salida
tiposSalida(): Observable<RespuestaSalidas> {
  return this.http.get<RespuestaSalidas>(`${this.apiUrl}/salidas/tiposSalida`)
  .pipe(
    catchError(this.errorS.handleError)
  );
}
//Si ya existe una detalle de inventario, se obtienen los productos registrados para seleccionarlos al generar salidas, ademas se obtienen los tipos de salidas al mismo tiempo
obtenerDatos(): Observable<RespuestaDatos> {
  return this.verExiteApertura().pipe(
    
    switchMap((respuesta: salidaCabHabilitado): Observable<RespuestaDatos> => {
      if (respuesta.habilitado) {
        return forkJoin([
          this.productosSalida(),
          this.tiposSalida()
        ]).pipe(
          map((Respuestas: [RespuestaProductos, RespuestaSalidas]): RespuestaDatos => {
            return ({ mostrar: true, descripcion:respuesta.descripcion ,producto: Respuestas[0].producto, salida:Respuestas[1].salida, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura })
          })

        );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
      );
    }

/*TODO:
PETICIONES EN SERIE: switchMap
PETICIONES EN PARALELO: forkJoin
map te funciona para manipular la respuesta del observable y transformarlo en otro valor diferente y lo que estas necesitando en este punto es transformar el observable a otro, por lo cual el operador que necesitas es switchMap
https://www.google.com/search?q=como+puedo+realizar+dos+peticiones+al+mismo+tiempo+en+angular&rlz=1C1UUXU_esPY951PY951&oq=como+puedo+realizar+dos+peticiones+al+mismo+tiempo+en+angular&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhA0gEONTIyNTg1MDQ5ajBqMTWoAgCwAgA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:85852525,vid:duxgN9RXO2I
https://adrianub.dev/blog/combinando-multiples-flujos-http-con-rxjs-observables-en-angular/
*/

//registra las salidas TODO: POR AHORA SE OBTIENEN TODOS LOS PRODUCTOS DE LA TABLA PRODUCTO AL BUSCAR POR ENDE SI AL INICIAR LA APERTURA NO ESTABA ESE PRODUCTO LANZARA UN ERROR Y NO DE PODRA REGISTRAR
registrarSalida(recepcion: GuardarSalida): Observable<respuestaMensaje> {
  console.log(recepcion)
  return this.http.post<respuestaMensaje>(`${this.apiUrl}/salidas/registrarSalida`, { ...recepcion })
    .pipe(
      catchError(this.errorS.handleError)
  );
}

//para obtener las salidas ya registradas el dia de hoy en la sucursal del usuario logeado
visualizarSalidas(): Observable<RespuestaSalidasVisualizar> {
  return this.http.get<RespuestaSalidasVisualizar>(`${this.apiUrl}/salidas/visualizarSalidas`)
  .pipe(
    catchError(this.errorS.handleError)
  );
}

//si ya existe una apertura de inventario obtener los datos de las salidas registradas
obtenerDatosVisualizar(): Observable<RespuestaDatosVisualizarSalida> {
  return this.verExiteApertura().pipe(
    switchMap((respuesta: salidaCabHabilitado): Observable<RespuestaDatosVisualizarSalida> => {
      if (respuesta.habilitado) {
        return this.visualizarSalidas().pipe(
          map((RespuestaPrs: RespuestaSalidasVisualizar): RespuestaDatosVisualizarSalida => {
            return ({ mostrar: true, descripcion:respuesta.descripcion ,dsalida: RespuestaPrs.dSalida, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura })
          })
        );
      } else {
        return of({ mostrar: false, descripcion:respuesta.descripcion });
      }
    })
  );
}

}
