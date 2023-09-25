import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, switchMap, map, of } from 'rxjs';
import { GuardarRecepcion, ProdRecibido, RespuestaDatos, recCabHabilitado } from '../modelos/recepcion-productos.model';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { RespuestaProductos } from '../modelos/inv-rend.model';

@Injectable({
  providedIn: 'root'
})
export class RecepcionProductosService {
//ruta
private apiUrl = `${environment.API_URL}/api`;

constructor(
  private http: HttpClient,
  private errorS:ManejarErrorService,
  private autService:AutentificacionService
) { }

  //PARA ALMACENAR LOS DATOS DE MANERA TEMPORAL
  
  /*FIXME:
    const storedData = localStorage.getItem('productosRecepcion');: Esta línea de código intenta recuperar un valor almacenado en el objeto 
    localStorage bajo la clave 'productosRecepcion'. localStorage es un objeto en el navegador web que permite almacenar datos de forma 
    persistente en el navegador.

    if (storedData) {: Esta condición verifica si storedData tiene un valor distinto de null o undefined. En otras palabras, verifica si 
    hay datos almacenados bajo la clave 'productosRecepcion'.

    const { fecha, items, observacion, nroComprobante, uId } = JSON.parse(storedData);: Si hay datos almacenados, esta línea de código 
    deserializa el valor recuperado de localStorage (que es una cadena JSON) utilizando JSON.parse(). Luego, desestructura ese objeto JSON 
    en las variables fecha, items, observacion, nroComprobante, y uId.

    if (storedDate.toDateString() === currentDate.toDateString() && uId == this.autService.usuario.idUsuario) {: Esta condición verifica dos cosas:

    Si la fecha almacenada es igual a la fecha actual. Esto se hace comparando las cadenas de texto generadas por toDateString() de ambas fechas. 
    Esto garantiza que los datos almacenados solo se devuelvan si fueron almacenados en el mismo día. Y Si el valor de uId coincide con el idUsuario 
    almacenado en propiedad de this.autService.usuario. Si se cumplen las condiciones anteriores, la función devuelve un objeto con las propiedades items, 
    observacion y nroComprobante. Estos son los datos almacenados bajo la clave 'productosRecepcion'.

    Si no se cumplen las condiciones en la condición if inicial o si no se encuentra ningún dato en localStorage, la función devuelve un objeto vacío {}.
  */
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

  /*FIXME: Guardar datos en el localStorage
    saveItems(items:ProdRecibido[], observacion:string='', nroComprobante: string='') {: Esta línea define la función saveItems que toma tres parámetros:

    items: Un array de elementos de tipo ProdRecibido.
    observacion: Una cadena de texto que representa observaciones relacionadas con los elementos recibidos. Es opcional y tiene un valor predeterminado de una cadena vacía ''.
    nroComprobante: Una cadena de texto que representa un número de comprobante relacionado con los elementos recibidos. También es opcional y tiene un valor predeterminado de una cadena vacía ''.
    const currentDate = new Date().toISOString();: Esta línea crea una variable currentDate que almacena la fecha y hora actual en formato ISO .

    const data = { fecha: currentDate, items: items, observacion, nroComprobante, uId:this.autService.usuario.idUsuario };: Se crea un objeto llamado data que contiene los siguientes campos:

    fecha: Almacena la fecha y hora actual en formato ISO, como se obtuvo anteriormente.
    items: Almacena el array de elementos recibidos pasado como argumento a la función.
    observacion: Almacena la observación (si se proporcionó como argumento) o una cadena vacía si no se proporcionó.
    nroComprobante: Almacena el número de comprobante (si se proporcionó como argumento) o una cadena vacía si no se proporcionó.
    uId: Almacena la identificación de usuario obtenida desde this.autService.usuario.idUsuario.Esta relacionado con la identificación del usuario que está utilizando la aplicación.
    localStorage.setItem('productosRecepcion', JSON.stringify(data));: Finalmente, se utiliza localStorage.setItem() para almacenar los datos del objeto data en el almacenamiento local del navegador 
    bajo la clave 'productosRecepcion'. Antes de almacenarlo, se convierte el objeto data en una cadena JSON utilizando JSON.stringify() para que pueda ser guardado en el localStorage
  */
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

  /*
    se utiliza para eliminar el elemento almacenado bajo la clave 'productosRecepcion' en el almacenamiento local del navegador. 
  */
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
    catchError(this.errorS.handleError)
  );
} 

productosRecepcion(): Observable<RespuestaProductos> {
  return this.http.get<RespuestaProductos>(`${this.apiUrl}/inventarios/productosInventario`)
  .pipe(
    catchError(this.errorS.handleError)
  );
}

//Si ya existe una detalle de inventario, se obtienen los productos registrados para seleccionarlos al generar recepciones
obtenerDatos(): Observable<RespuestaDatos> {
  return this.verExiteApertura().pipe(
    switchMap((respuesta: recCabHabilitado): Observable<RespuestaDatos> => {
      if (respuesta.habilitado) {
        return this.productosRecepcion().pipe(
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
      catchError(this.errorS.handleError)
  );
}

}
