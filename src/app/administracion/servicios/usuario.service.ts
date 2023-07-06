import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError,switchMap, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActualizarUsuario, EliminadoUsuario, GuardarUsuario, RespuestaUsuarios, RolSucursal, Usuario } from '../modelos/usuario.model';
import { RolService } from './rol.service';
import { SucursalService } from './sucursal.service';
import { RespuestaRoles, Rol } from '../modelos/rol.model';
import { RespuestaSucursales, Sucursal } from '../modelos/sucursal.model';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.API_URL}/api/usuarios`;

  params = {};

  constructor(
    private http: HttpClient,
    private errorS:ManejarErrorService,
    private servicioRol:RolService,
    private servicioSucursal:SucursalService

  ) { }

  ////PARA VALIDACIONES ASINCRONAS - POR AHORA NO SE USA
  correoHabilitado(correo: string) {
    return this.http.get(`${this.apiUrl}/`, {
      params: {
        correo
      }
    })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg))
        })
      );
  }

  crear(usuario: GuardarUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, { ...usuario })
      .pipe(
        catchError(this.errorS.handleError)//cuando existen diferentes tipos de respuestas
      );
  }
                                                          //0: inactivo 1: activo -1:todos
  obtenerUsuarios(limite: number = -1, desde: number = -1, activo: 0 | 1 |-1 = -1): Observable<RespuestaUsuarios> {
    //if (limite != -1 && desde != -1) {
    if (limite >=desde && desde >=0) {

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

    return this.http.get<RespuestaUsuarios>(`${this.apiUrl}`, {
      params: this.params
    })
      .pipe(
       catchError(this.errorS.handleError)
      );
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  actualizar(id: number, usuario: ActualizarUsuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, { ...usuario })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }

  eliminar(id: number): Observable<EliminadoUsuario> {
    return this.http.delete<EliminadoUsuario>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.errorS.handleError)
      )
  }

  //PARA OBTENER ROLES Y SUCURSALES
  obtenerRolesYSucursales(): Observable<RolSucursal> {
    const obtenerRoles$ = this.servicioRol.obtenerRoles(undefined, undefined, undefined, 'F'); //todos los roles de tipo F
    const obtenerSucursales$ = this.servicioSucursal.obtenerSucursales();//todas las sucursales
  
    return obtenerRoles$.pipe(
      switchMap((roles: RespuestaRoles) => {
        return obtenerSucursales$.pipe(
          map((sucursales: RespuestaSucursales) => {
            return { roles: roles.rol, sucursales: sucursales.sucursal };
          })
        );
      })
    );
  }

  cambiarContrasena(id: number, nuevaContrasena: string): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/cambiarContra/${id}`, { nuevaContrasena })
      .pipe(
        catchError(this.errorS.handleError)
      );
  }
  
  
}
