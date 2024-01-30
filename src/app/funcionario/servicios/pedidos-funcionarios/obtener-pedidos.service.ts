import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatosFiltroCabecera, DatosFiltroPedidos_sucursalMarca, RespDatosCabeceraPedidos } from '../../modelos/pedido-funcionario';
import { Observable, catchError, throwError } from 'rxjs';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObtenerPedidosService {

 //ruta
 private apiUrl = `${environment.API_URL}/api`;

 //para enviar parametros de filtrado de los get's
 params = {};

 constructor(
  private http: HttpClient,
  private errorS: ManejarErrorService,
) { }

  //!pedidos enviados

  //FIXME: listado de cabeceras de los pedidos que he realizado
  obtenerCabeceras(data:DatosFiltroCabecera): Observable<RespDatosCabeceraPedidos> {
    this.params=data;
 
    return this.http.get<RespDatosCabeceraPedidos>(`${this.apiUrl}/pedidosFuncionarios/verCabecerasPedidosEnviados`, {
      params:this.params
    })
    .pipe(
      catchError(this.errorS.handleError)
    );
  }

  //FIXME: una vez seleccionado el pedido del listado anterior, se podra obtener el detalle del mismo con el sgte servicio
  obtenerDetallePedido(idCabecera:number): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiUrl}/pedidosFuncionarios/verDetalleCabPedidosEnviadosPDF/${idCabecera}`, { headers, responseType: 'blob' })
    .pipe(
     catchError((error: HttpErrorResponse) => {
       // Analizar el código de estado del error
       switch (error.status) {
         case 500:
           return throwError(() => (['Error al generar pdf' ]));
         default:
           return throwError(() => ([ 'Error desconocido' ]));
       }
     })
   );
  }

  verTotalPedidosEnviadosPDF(datos:any): Observable<Blob> {
      
    this.params=datos; //funciona

    return this.http.get(`${this.apiUrl}/pedidosFuncionarios/verTotalPedidosEnviadosPDF/`, { 
      responseType: 'blob',
      params:this.params
    })
    .pipe(
     catchError((error: HttpErrorResponse) => {
       // Analizar el código de estado del error
       switch (error.status) {
         case 500:
           return throwError(() => (['Error al generar pdf' ]));
         default:
           return throwError(() => ([ 'Error desconocido' ]));
       }
     })
   );
  }

  //!pedidos recibidos
    verPedidosPorSucursalYmarcaPDF(datos:DatosFiltroPedidos_sucursalMarca): Observable<Blob> {
      
      this.params=datos; //funciona

      // let param:any=datos; funciona


      //no funciona
      // let params = new HttpParams();

      // Object.keys(datos).forEach((key:any) => {
      //   params = params.append(String(key), String(datos[key]));
      // });

      // console.log("this.params ", this.params, " - ", typeof(this.params))

      //*solo se aceptan parametros de tipo strings
      return this.http.get(`${this.apiUrl}/pedidosFuncionarios/verPedidosPorSucursalYmarcaPDF/`, { 
        responseType: 'blob',
        params:this.params
      })
      .pipe(
       catchError((error: HttpErrorResponse) => {
         // Analizar el código de estado del error
         switch (error.status) {
           case 500:
             return throwError(() => (['Error al generar pdf' ]));
           default:
             return throwError(() => ([ 'Error desconocido' ]));
         }
       })
     );
    }

    verTotalPedidosRecibidosPDF(datos:DatosFiltroPedidos_sucursalMarca): Observable<Blob> {
      
      this.params=datos; //funciona

      //*solo se aceptan parametros de tipo strings
      return this.http.get(`${this.apiUrl}/pedidosFuncionarios/verTotalPedidosRecibidosPDF/`, { 
        responseType: 'blob',
        params:this.params
      })
      .pipe(
       catchError((error: HttpErrorResponse) => {
         // Analizar el código de estado del error
         switch (error.status) {
           case 500:
             return throwError(() => (['Error al generar pdf' ]));
           default:
             return throwError(() => ([ 'Error desconocido' ]));
         }
       })
     );
    }
}
