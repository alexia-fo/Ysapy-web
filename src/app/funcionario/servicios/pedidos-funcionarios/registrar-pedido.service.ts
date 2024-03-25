import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { GuardarPedido, PedidoObtenido, RespuestaDatosPedido, RespuestaMarcas, RespuestaProductos, RespuestaTurnoPedido, pedidoCabHabilitado } from '../../modelos/pedido-funcionario';

@Injectable({
  providedIn: 'root'
})
export class RegistrarPedidoService {

  private apiUrl = `${environment.API_URL}/api`;
  params = {};


  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService
  ) { }

  //FIXME: verifica si en un horario aún se pueden realizar pedidos
  // verHabilitado(): Observable<pedidoCabHabilitado> {
  //   return this.http.get<pedidoCabHabilitado>(`${this.apiUrl}/pedidosFuncionarios/verHabilitacion`)
  //   .pipe(
  //     catchError(this.errorS.handleError)
  //   );
  // } 

  
  //FIXME: 2. OBTENER LAS MARCAS REGISTRADAS PARA COMBO (UNA VEZ SELECCIONADA LA MARCA SE SOLICITARAN LOS PRODUCTOS DE ESA MARCA)
  marcas(): Observable<RespuestaMarcas> {
    return this.http.get<RespuestaMarcas>(`${this.apiUrl}/pedidosFuncionarios/marcas`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

    //FIXME: 3. OBTIENE EL LISTADO DE PRODUCTOS QUE CORRESPONDEN A UNA MARCA, ESTOS PRODUCTOS SERAN SELECCIONADOS PARA REALIZAR LOS PEDIDOS
    productosMarca(idMarca:number): Observable<RespuestaProductos> {
      return this.http.get<RespuestaProductos>(`${this.apiUrl}/pedidosFuncionarios/productos/${idMarca}`)
      .pipe(
        catchError(this.errorS.handleError)
      );
    }

    //FIXME: 4. OBTIENE EL LISTADOS DE TURNOS QUE SE ENCUENTRAN CON LOS PARAMETROS DE LA BASE DE DATOS
    obtenerTurnos(): Observable<RespuestaTurnoPedido> {
      return this.http.get<RespuestaTurnoPedido>(`${this.apiUrl}/pedidosFuncionarios/turnos/`)
      .pipe(
        catchError(this.errorS.handleError)
      );
    }

    // función para obtener las marcas y los turnos simultáneamente
    obtenerMarcasYTurnos(): Observable<any> {
      // Ejecutar las dos primeras consultas simultáneamente usando forkJoin
      return forkJoin({
        marcas: this.marcas(),
        turnos: this.obtenerTurnos()
      });
    }

    
    obtenerDatos(): Observable<RespuestaDatosPedido> {
      // return this.verHabilitado().pipe(
        // switchMap((respuesta: pedidoCabHabilitado): Observable<RespuestaDatosPedido> => {
        //   if (respuesta.habilitado) {
        //     // Usar forkJoin para combinar múltiples solicitudes en paralelo
            return forkJoin({
              marcas: this.marcas(),
              turnos: this.obtenerTurnos()
            }).pipe(
              map(( respuestas : { marcas: RespuestaMarcas, turnos: RespuestaTurnoPedido }) => {
                return {
                  mostrar: true,
                  // descripcion: respuesta.descripcion,
                  marca: respuestas.marcas.marca,
                  // idCabeceraInv: respuesta.idCabeceraInv,
                  // fechaApertura: respuesta.fechaApertura,
                  turnos: respuestas.turnos.turno // Incluir los turnos en la respuesta
                };
              })
            );
          // } else {
          //   return of({
          //     mostrar: false,
          //     descripcion: respuesta.descripcion,
          //     idCabeceraInv: respuesta.idCabeceraInv,
          //     fechaApertura: respuesta.fechaApertura
          //   });
          // }
        // })
    //  );
    }



  pedidoHabilitado(fechaEntrega: string, codMarca:string, codTurno:string) {
    return this.http.get(`${this.apiUrl}/pedidosFuncionarios/verHorarioHabilitado`, {
      params: {
        fechaEntrega,
        codMarca,
        codTurno
      }
    })
    .pipe(
      tap((resp)=>{
         console.log("parametros fechaEntrega "+fechaEntrega+" y codMarca "+codMarca)
         console.log("respuesta val ", resp)
      }),
      catchError((response: HttpErrorResponse) => {
        return throwError(() => new Error(response.error.msg))
      })
    );
  }


  registrarPedidos(pedido: GuardarPedido): Observable<respuestaMensaje> {
    return this.http.post<respuestaMensaje>(`${this.apiUrl}/pedidosFuncionarios/registrarPedido`, { ...pedido })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

  //FIXME: PARA EDITAR PEDIDOS
  obtenerPedido(idCabecera:number): Observable<PedidoObtenido> {
    // console.log(`--- id cabecera servicio ${idCabecera}`)
    return this.http.get<PedidoObtenido>(`${this.apiUrl}/pedidosFuncionarios/pedidoGet/${idCabecera}`)
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  editarPedidos(pedido: GuardarPedido, idCabecera: number): Observable<respuestaMensaje> {
    return this.http.put<respuestaMensaje>(`${this.apiUrl}/pedidosFuncionarios/editarPedido/${idCabecera}`, { ...pedido })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
    );
  }

}
