import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { environment } from 'src/environments/environment.prod';
import { GuardarInventario, GuardarRendicion, RespuestaDatosCab, RespuestaDatosDinero, RespuestaDatosProducto, RespuestaDatosVisualizarInv, RespuestaDetInventarioVisualizar, RespuestaDineros, RespuestaInventariosVisualizar, RespuestaProducto, RespuestaProductos, RespuestaSucursal, guardarCabecera, invCabHabilitado, invProdHabilitado, rendCajaHabilitado } from '../modelos/inv-rend.model';
import { Observable, catchError, switchMap, tap, map, of } from 'rxjs';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

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

  //! --- Cabecera de Inventario ---

  //**verifica si el inventario se encuentra habilitado
  verExiteApertura(): Observable<invCabHabilitado> {
    return this.http.get<invCabHabilitado>(`${this.apiUrl}/inventarios/verExisteApertura`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  } 

  //**obtiene el nombre de sucursal del usuario activo
  sucDeUsuario(): Observable<RespuestaSucursal> {
    return this.http.get<RespuestaSucursal>(`${this.apiUrl}/inventarios/sucDeUsuario`)
      .pipe(
        catchError(this.errorS.handleError)
    );
  }
 
  /*
    obtenerDatosCabecera() es una función que no toma ningún argumento y devuelve un Observable de tipo RespuestaDatosCab.

    La función comienza llamando a verExiteApertura(). Esto parece ser una llamada a una función o método que devuelve un Observable de tipo invCabHabilitado. 

    Luego, se utiliza el operador pipe() para encadenar operaciones adicionales al Observable devuelto por verExiteApertura(). En este caso, se utiliza switchMap().

    switchMap() es un operador que toma el valor emitido por el Observable anterior (verExiteApertura() en este caso) y lo mapea a otro Observable. Dentro de switchMap(), 
    se proporciona una función que toma el valor emitido por verExiteApertura ( de tipo invCabHabilitado) como su argumento.

    Dentro de la función pasada a switchMap(), se verifica si la propiedad habilitado en el objeto respuesta (que es el valor emitido por verExiteApertura()) es verdadera 
    o falsa.

    Si habilitado es verdadero, entonces se llama a sucDeUsuario(), que es otra función que devuelve un Observable de tipo RespuestaSucursal. Este Observable se pasa 
    a través del operador map(), que transforma el valor emitido por sucDeUsuario() en un objeto de tipo RespuestaDatosCab. En este caso, se crea un objeto con la propiedad 
    mostrar establecida en true, y se copia la propiedad descripcion del objeto respuesta y la propiedad sucursal del objeto emitido por sucDeUsuario().

    Si habilitado es falso, se utiliza of() para crear un Observable que emite un objeto de tipo RespuestaDatosCab con la propiedad mostrar establecida en false, y se copia 
    la propiedad descripcion del objeto respuesta.

    En síntesis, la consulta verifica si el inventario se encuentra habilitado, si esta habilitado, consulta la sucursal del usuario, si no esta habilitado no se es necesario consultarlo
  */
  obtenerDatosCabecera(): Observable<RespuestaDatosCab> {
    return this.verExiteApertura().pipe(
      switchMap((respuesta: invCabHabilitado): Observable<RespuestaDatosCab> => {
        if (respuesta.habilitado) {
          return this.sucDeUsuario().pipe(
            map((RespuestaSucursal: RespuestaSucursal): RespuestaDatosCab => {
              return ({ mostrar: true, descripcion:respuesta.descripcion, sucursal: RespuestaSucursal.sucursal })
            })
          );
        } else { //si existe cabecera mostrar=false, si existe se obtiene el id y la cabecera
          return of({ mostrar: false, descripcion:respuesta.descripcion, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura });
        }
      })
    );
  }  

  //**inserta una nueva cabecera de inventario
  crearApertura(datos: guardarCabecera): Observable<respuestaMensaje> {
    return this.http.post<respuestaMensaje>(`${this.apiUrl}/inventarios/crearApertura`, { ...datos })
      .pipe(
        catchError(this.errorS.handleError)
    );
  }

  //! --- Detalle de inventario ---

  //** Verifica si el inventario de productos se encuentra disponible 
  /*
    Si se va a registrar un inventario de producto se verifica si se encuentra habilitado
    (cuando se va a registrar el inventario por primera vez o apertura, se verifica que haya una apertura - o cabecera
    cuando se va a registrar la segunda vez o cierre, se verifica que existe una apertura y/o cierre de rendicion caja) 
  */
  verificarInventario():Observable<invProdHabilitado>{
    return this.http.get<invProdHabilitado>(`${this.apiUrl}/inventarios/verificarInventario`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  //** Obtiene el listado de productos "facturables y activos"
  productosInventario(): Observable<RespuestaProductos> {
    return this.http.get<RespuestaProductos>(`${this.apiUrl}/inventarios/productosInventario`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }
  
  /*

    Dentro de la función pasada a switchMap(), se verifica si la propiedad habilitado en el objeto respuesta 
    (que es el valor emitido por verificarInventario()) es verdadera o falsa.

    Si habilitado es verdadero, se llama a productosInventario(), que es otra función que devuelve un 
    Observable de tipo RespuestaProductos. Este Observable se pasa a través del operador map(), que transforma 
    el valor emitido por productosInventario() en un objeto de tipo RespuestaDatosProducto. En este caso, se 
    crea un objeto con la propiedad mostrar establecida en true, y se copian la propiedad descripcion del objeto 
    respuesta y la propiedad productos del objeto emitido por productosInventario().

    Si habilitado es falso, se utiliza of() para crear un Observable que emite un objeto de tipo RespuestaDatosProducto 
    con la propiedad mostrar establecida en false y se copia la propiedad descripcion del objeto respuesta.

    En síntesis, la consulta verifica si el inventario de productos se encuentra habilitado, si esta habilitado, consulta 
    los productos, si no esta habilitado no se es necesario consultarlo.
  */
  obtenerDatosProducto(): Observable<RespuestaDatosProducto> {
    return this.verificarInventario().pipe(
      switchMap((respuesta: invProdHabilitado): Observable<RespuestaDatosProducto> => {
        if (respuesta.habilitado) {
          return this.productosInventario().pipe(
            tap((respuestapr:any)=>{
              console.log('tap ', respuestapr)
            }),
            map((respuestaProductos: RespuestaProductos): RespuestaDatosProducto => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,productos: respuestaProductos.producto, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura  })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura}); // el id y la fecha vienen igual si el inventario no esta habilitado pq no existe detalle de rendicion de caja pero ya existe cabecera
          //el id y la fecha no viene solo en el caso de que aun no exista apertura es decir una cabecera
        }
      })
    );
  }

  registrarInventario(inventario: GuardarInventario): Observable<respuestaMensaje> {
    return this.http.post<respuestaMensaje>(`${this.apiUrl}/inventarios/registrarInventario`, { ...inventario })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  //! --- Rendicion caja ---

  //FIXME: Verifica si la rendicion de caja se encuentra disponible 
  /*
    Si se va a registrar una rendicion de caja se verifica si se encuentra habilitado
    (cuando se va a registrar la rendicion por primera vez o apertura, se verifica que haya una apertura - o cabecera
    cuando se va a registrar la segunda vez o cierre, se verifica que existe una apertura y/o cierre de rendicion caja) 
  */
  verificarRendicion():Observable<rendCajaHabilitado>{
    return this.http.get<rendCajaHabilitado>(`${this.apiUrl}/inventarios/verificarRendicion`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  //FIXME: Obtiene el listado de dineros
  dinerosRendicion(): Observable<RespuestaDineros> {
    return this.http.get<RespuestaDineros>(`${this.apiUrl}/inventarios/dinerosRendicion`)
    .pipe(
      catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  /*FIXME:

    Dentro de la función pasada a switchMap(), se verifica si la propiedad habilitado en el objeto respuesta 
    (que es el valor emitido por verificarRendicion()) es verdadera o falsa.

    Si habilitado es verdadero, se llama a dinerosRendicion(), que parece ser otra función que devuelve un 
    Observable de tipo RespuestaDineros. Este Observable se pasa a través del operador map(), que transforma 
    el valor emitido por dinerosRendicion() en un objeto de tipo RespuestaDatosDinero. En este caso, se crea 
    un objeto con la propiedad mostrar establecida en true, y se copian la propiedad descripcion del objeto respuesta 
    y la propiedad dineros del objeto emitido por dinerosRendicion().

    Si habilitado es falso, se utiliza of() para crear un Observable que emite un objeto de tipo RespuestaDatosDinero con 
    la propiedad mostrar establecida en false y se copia la propiedad descripcion del objeto respuesta.

    En síntesis, la consulta verifica si la rendicion de caja se encuentra habilitado, si esta habilitado, consulta 
    los dineros, si no esta habilitado no se es necesario consultarlo.
  */
  obtenerDatosDinero(): Observable<RespuestaDatosDinero> {
    return this.verificarRendicion().pipe(
      switchMap((respuesta: rendCajaHabilitado): Observable<RespuestaDatosDinero> => {
        if (respuesta.habilitado) {
          return this.dinerosRendicion().pipe(
            map((respuestaDineros: RespuestaDineros): RespuestaDatosDinero => {
              return ({ mostrar: true, descripcion:respuesta.descripcion ,dineros: respuestaDineros.dinero, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura });
        }
      })
    );
  }

  registrarRendicion(rendicion: GuardarRendicion): Observable<respuestaMensaje> {
    return this.http.post<respuestaMensaje>(`${this.apiUrl}/inventarios/registrarRendicion`, { ...rendicion })
      .pipe(
        catchError(this.errorS.handleError)
    );
  }

  /*FIXME: para obtener la informacion de producto al presionar enter en el campo id de producto 
  en recepcion y en salida de productos */

  obtenerProductoPorId(idProducto:number): Observable<RespuestaProducto> {
    return this.http.get<RespuestaProducto>(`${this.apiUrl}/inventarios/producto/${idProducto}`)
      .pipe(
        catchError(this.errorS.handleError)
    );
  }

  //para visualizar el inventario registrado por los usuarios
  visualizarInventarios(): Observable<RespuestaDetInventarioVisualizar> {
    return this.http.get<RespuestaDetInventarioVisualizar>(`${this.apiUrl}/inventarios/visualizarInventario`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  //si ya existe una apertura de inventario obtener los datos de las recepciones registradas
  obtenerDatosVisualizar(): Observable<RespuestaDatosVisualizarInv> {
    return this.verExiteApertura().pipe(
      switchMap((respuesta: invCabHabilitado): Observable<RespuestaDatosVisualizarInv> => {
        if (!respuesta.habilitado) {
          return this.visualizarInventarios().pipe(
            map((RespuestaPrs: RespuestaDetInventarioVisualizar): RespuestaDatosVisualizarInv => {
              return ({ mostrar: true, descripcion:respuesta.descripcion , dinventario: RespuestaPrs.dInventario, idCabeceraInv:respuesta.idCabeceraInv, fechaApertura: respuesta.fechaApertura })
            })
          );
        } else {
          return of({ mostrar: false, descripcion:respuesta.descripcion });
        }
      })
    );
  }

  controlMegas(megas:{megas:string}): Observable<respuestaMensaje> {
    return this.http.put<respuestaMensaje>(`${this.apiUrl}/inventarios/controlMegas`, { ...megas })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }


}
