import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { RespuestaCabecera, RespuestaCalculosRendicion, RespuestaDetRecepcion, RespuestaDetSalida, DatosFiltro, RespuestaFiltros, RespuestaRendicion, RespuestaDetalleRendicion, RespuestaCalculos, RecepcionVisualizar, RespuestaRecepcionesVisualizar, RespuestaSalidasVisualiza, DatosFiltroComparacionInv, ActualizarCantidades, CabeceraRecepcion, RespuestaCabeceraRecepcion, RespuestaDetalleInventario } from '../modelos/inventariosRegistrados';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { GuardarRecepcion } from 'src/app/funcionario/modelos/recepcion-productos.model';

@Injectable({
  providedIn: 'root'
})
export class InventariosRegistradosService {
 //ruta
 private apiUrl = `${environment.API_URL}/api`;

 //para enviar parametros de filtrado de los get's
 params = {};

 constructor(
   private http: HttpClient,
   private errorS: ManejarErrorService,
 ) { }

 obtenerCabeceras(data:DatosFiltro): Observable<RespuestaCabecera> {
   this.params=data;

   return this.http.get<RespuestaCabecera>(`${this.apiUrl}/inventariosRegistrados/obtenerCabecerasInventario`, {
     params:this.params
   })
   .pipe(
     catchError(this.errorS.handleError)
   );
 }

 
 obtenerCalculoRendicion(idCabecera:number): Observable<RespuestaCalculosRendicion> {

   return this.http.get<RespuestaCalculosRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerCalculoRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }

 obtenerRendicion(idCabecera:number): Observable<RespuestaRendicion> {

   return this.http.get<RespuestaRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
 }

  //FIXME:

 obtenerCalculos(idCabecera:number): Observable<RespuestaCalculos> {

   return this.http.get<RespuestaCalculos>(`${this.apiUrl}/inventariosRegistrados/obtenerCalculos/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }

 obtenerDetalleInventario(idCabecera:number): Observable<RespuestaDetalleInventario> {

   return this.http.get<RespuestaDetalleInventario>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleInventario/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );
 }

 obtenerDetalleRendicion(idCabecera:number): Observable<RespuestaDetalleRendicion> {

   return this.http.get<RespuestaDetalleRendicion>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleRendicion/${idCabecera}`)
     .pipe(
       catchError(this.errorS.handleError)
     );

 }
 //FIXME:

 obtenerDetalleRecepcion(idCabecera:number, idProducto:number): Observable<RespuestaDetRecepcion> {
   this.params={
     idCabecera,
     idProducto
   }

   return this.http.get<RespuestaDetRecepcion>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleRecepcion`, {
     params:this.params
   })
     .pipe(
       catchError(this.errorS.handleError)
     );
 }

 obtenerRecepciones(idCabecera:number): Observable<RespuestaRecepcionesVisualizar> {
  this.params={
    idCabecera,
  }

  return this.http.get<RespuestaRecepcionesVisualizar>(`${this.apiUrl}/inventariosRegistrados/obtenerRecepciones`, {
    params:this.params
  })
    .pipe(
      catchError(this.errorS.handleError)
    );
}


 obtenerDetalleSalida(idCabecera:number, idProducto:number): Observable<RespuestaDetSalida> {
   this.params={
     idCabecera,
     idProducto
   }


   return this.http.get<RespuestaDetSalida>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleSalida`, {
     params:this.params
   })
     .pipe(
       catchError(this.errorS.handleError)
     );
 }


 obtenerSalidas(idCabecera:number): Observable<RespuestaSalidasVisualiza> {
  this.params={
    idCabecera,
  }

  return this.http.get<RespuestaSalidasVisualiza>(`${this.apiUrl}/inventariosRegistrados/obtenerSalidas`, {
    params:this.params
  })
    .pipe(
      catchError(this.errorS.handleError)
    );
}

 //////////////// PDF ///////////

 obtenerDetalleInventarioPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerDetalleInventario/${idCabecera}`, { headers, responseType: 'blob' })
   .pipe(
    catchError(this.errorS.handleError)
  );
 }
 obtenerVentasPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerVentasInventario/${idCabecera}`, { headers, responseType: 'blob' })
   .pipe(
    catchError(this.errorS.handleError)
  );
 }
 obtenerDetalleRendicionPDF(idCabecera:number): Observable<Blob> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.get(`${this.apiUrl}/informesAdmin/obtenerRendicion/${idCabecera}`, { headers, responseType: 'blob' })
   .pipe(
    catchError(this.errorS.handleError)
  );
 }

 obtenerRecepcionesPDF(idCabecera:number): Observable<Blob> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get(`${this.apiUrl}/informesAdmin/obtenerRecepciones/${idCabecera}`, { headers, responseType: 'blob' })
  .pipe(
    catchError(this.errorS.handleError)
  );
}

obtenerSalidasPDF(idCabecera:number): Observable<Blob> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get(`${this.apiUrl}/informesAdmin/obtenerSalidas/${idCabecera}`, { headers, responseType: 'blob' })
  .pipe(
    catchError(this.errorS.handleError)
  );
}


// inventariosConsecutivos(datos:DatosFiltroComparacionInv): Observable<Blob> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//   return this.http.get(`${this.apiUrl}/informesAdmin/inventariosConsecutivos`, { headers, responseType: 'blob' });
// }

  inventariosConsecutivos(datos: DatosFiltroComparacionInv): Observable<Blob | any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    // Asegúrate de formatear las fechas según tus necesidades
    const params = {
      idSucursal: datos.idSucursal,
      turno1: datos.turno1,
      fecha1: datos.fecha1,
      turno2: datos.turno2,
      fecha2: datos.fecha2,
    };

    return this.http.get(`${this.apiUrl}/informesAdmin/inventariosConsecutivos`, {
      headers,
      responseType: 'blob',
      params,  // Incluir los parámetros en la URL
    })
    .pipe(
      //no puedo utilizar la funcion handleError porque la respuesta se obtiene en formato blob o pdf y no puedo mostrar los mensajes
      //ya que deberia de obtener en formato json
      catchError((error: HttpErrorResponse) => {
        // Analizar el código de estado del error
        switch (error.status) {
          case 500:
            return throwError(() => (['Error al generar pdf' ]));
          case 501:
            return throwError(() => (['Inventarios insuficientes'] ));
          // Agrega más casos según sea necesario
          default:
            return throwError(() => ([ 'Error desconocido' ]));
        }
      })
    );
  }



// inventariosConsecutivos(datos: DatosFiltroComparacionInv): Observable<Blob> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//   // Asegúrate de formatear las fechas según tus necesidades
//   const params = new HttpParams()
//     .set('idSucursal', datos.idSucursal.toString())
//     .set('turno1', datos.turno1)
//     .set('fecha1', datos.fecha1)
//     .set('turno2', datos.turno2)
//     .set('fecha2', datos.fecha2);

//   return this.http.get<Blob>(`${this.apiUrl}/informesAdmin/inventariosConsecutivos`, {
//     headers,
//     // responseType: 'blob',  // Especificar que esperas un ArrayBuffer
//     // responseType: 'arraybuffer',  // Especificar que esperas un ArrayBuffer
//     params,  // Incluir los parámetros en la URL
//   }).pipe(
//     tap((respuesta:any)=>{
//       console.log(respuesta)
//     }),
//     // Transformar el ArrayBuffer en un Blob
//     // map((arrayBuffer: ArrayBuffer) => {
//     //   return new Blob([arrayBuffer], { type: 'application/pdf' });
//     // }),
//     catchError(this.errorS.handleError),

//   );
// }

// inventariosConsecutivos(datos: DatosFiltroComparacionInv): Observable<Blob> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//   this.params=datos;

//   return this.http.get(`${this.apiUrl}/informesAdmin/inventariosConsecutivos`, { 
//     headers, responseType: 'blob', params:this.params })
//   .pipe(
//     catchError(this.errorS.handleError)
//   );
// }

// inventariosConsecutivos(datos: DatosFiltroComparacionInv): Observable<Blob> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//   this.params = datos;

//   return this.http.get(`${this.apiUrl}/informesAdmin/inventariosConsecutivos`, {
//     headers,
//     responseType: 'blob',
//     params: this.params
//   }).pipe(
//     catchError(this.errorS.handleError) // Manejar errores
//   );
// }


editarCantidadProducto
(idCabecera:number, idProducto:number, datos:{cantidadApertura:number, cantidadCierre:number}): Observable<respuestaMensaje> {
  return this.http.put<respuestaMensaje>(`${this.apiUrl}/inventariosRegistrados/editarCantidadProducto/${idCabecera}/${idProducto}`, { ...datos })
    .pipe(
      catchError(this.errorS.handleError)
    );
}

editarCantidadesProductos
(idCabecera:number, datos:ActualizarCantidades): Observable<respuestaMensaje> {
  return this.http.put<respuestaMensaje>(`${this.apiUrl}/inventariosRegistrados/editarCantidadesProductos/${idCabecera}`, { ...datos })
  .pipe(
    catchError(this.errorS.handleError)
  );
}



//para editar recepciones 
obtenerCabecerasRecepciones(idCabecera:number): Observable<RespuestaCabeceraRecepcion> {
  
  return this.http.get<RespuestaCabeceraRecepcion>(`${this.apiUrl}/inventariosRegistrados/obtenerCabecerasRecepciones/${idCabecera}`, {
    params:this.params
  })
    .pipe(
      catchError(this.errorS.handleError)
    );
}



obtenerDetalleRecepcionCab(idCabecera:number, idCabeceraRec:number): Observable<RespuestaRecepcionesVisualizar> {
  console.log('idCabecera ', idCabecera, 'idrec ', idCabeceraRec)
  return this.http.get<RespuestaRecepcionesVisualizar>(`${this.apiUrl}/inventariosRegistrados/obtenerDetalleRecepcionCab/${idCabecera}/${idCabeceraRec}`, {
    params:this.params
  })
    .pipe(
      catchError(this.errorS.handleError)
    );
}

modificarEstadoRecepcion(id: number): Observable<respuestaMensaje> {
  return this.http.delete<respuestaMensaje>(`${this.apiUrl}/inventariosRegistrados/modificarEstadoRecepcion/${id}`)
    .pipe(
      catchError(this.errorS.handleError)
    )
}

//registra las recepciones TODO: POR AHORA SE OBTIENEN TODOS LOS PRODUCTOS DE LA TABLA PRODUCTO AL BUSCAR POR ENDE SI AL INICIAR LA APERTURA NO ESTABA ESE PRODUCTO LANZARA UN ERROR Y NO DE PODRA REGISTRAR
registrarRecepcion(recepcion: GuardarRecepcion, idCabecera:number): Observable<respuestaMensaje> {
  return this.http.post<respuestaMensaje>(`${this.apiUrl}/inventariosRegistrados/registrarMasRecepcion/${idCabecera}`, { ...recepcion })
    .pipe(
      catchError(this.errorS.handleError)
  );
}

}
