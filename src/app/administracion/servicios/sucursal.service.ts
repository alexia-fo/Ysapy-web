import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RespuestaSucursales, Sucursal, EliminadoSucursal, ActualizarSucursal, GuardarSucursal } from '../modelos/sucursal.model';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';
@Injectable({
  providedIn: 'root'
}) 
export class SucursalService {

    private apiUrl=`${environment.API_URL}/api/sucursales`;

    params={};

    constructor(
        private http:HttpClient,
        private errorS:ManejarErrorService
    ) { }

      ////PARA VALIDACIONES ASINCRONAS - POR AHORA NO SE USA
    sucursalHabilitada(nombre:string){
        return this.http.get(`${environment.API_URL}/api/sucursalHabilitada`, { 
          params: {
            nombre
          }
        })
        .pipe(
            catchError((response:HttpErrorResponse)=>{         
              return throwError(() => new Error(response.error.msg))
            })
        );
    }

    crear(sucursal:GuardarSucursal):Observable<Sucursal>{
        return this.http.post<Sucursal>(`${this.apiUrl}`, {...sucursal})
        .pipe(
            /*
            catchError((response:HttpErrorResponse)=>{
              return throwError(() => new Error(response.error.msg))
            })
            */
            catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
        );
    }

    obtenerSucursales(limite:number=-1, desde:number=-1, activo:number=-1):Observable<RespuestaSucursales>{

        if (limite != -1 && desde != -1) {

            if (activo != -1 ) {
              this.params = {
                limite,
                desde,
                activo
              }
            }else{
              this.params = {
                limite,
                desde
              }
            }
          }
      
          if (activo != -1 ) {
            this.params = {
              activo
            }
          }
    
        return this.http.get<RespuestaSucursales>(`${this.apiUrl}`, { 
            params: this.params
        })
        .pipe(
            catchError(this.errorS.handleError)
        );
    }

    obtenerSucursal(id:number):Observable<Sucursal>{
        return this.http.get<Sucursal>(`${this.apiUrl}/${id}`)
        .pipe(
            /*
            catchError((response:HttpErrorResponse)=>{         
                return throwError(() => new Error(response.error.msg))
            })
            */
            catchError(this.errorS.handleError)
        );
    }

    actualizar(id:number, sucursal:ActualizarSucursal):Observable<Sucursal>{
        return this.http.put<Sucursal>(`${this.apiUrl}/${id}`, {...sucursal})
        .pipe(
            /*
            catchError((response:HttpErrorResponse)=>{
                return throwError(() => new Error(response.error.msg))
            })
            */
            catchError(this.errorS.handleError)
        );
    }  

    eliminar(id:number):Observable<EliminadoSucursal>{
        return this.http.delete<EliminadoSucursal>(`${this.apiUrl}/${id}`)
        .pipe(
            /*
            catchError((response:HttpErrorResponse)=>{
                return throwError(() => new Error(response.error.msg))
            })
            */
            catchError(this.errorS.handleError)
        )
    }

}
