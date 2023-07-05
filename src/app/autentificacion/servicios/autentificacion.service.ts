import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment.prod';
import { Perfil, RespuestaAutentificacion, RespuestaPerfil, Usuario } from '../modelos/autentificacion';
import { ManejarErrorService } from 'src/app/utilidades/servicios/errores/manejar-error.service';


@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {

  private apiUrl = `${environment.API_URL}/api/auth`;

  private _usuario!: Perfil;


  get usuario() {
    return { ...this._usuario };
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private errorS: ManejarErrorService,
  ) { }

  ingresar(correo: string, contra: string): Observable<Usuario> {
    return this.http.post<RespuestaAutentificacion>(`${this.apiUrl}/login`, { correo, contra })
      .pipe(
        tap((response: RespuestaAutentificacion) => {
          this.tokenService.guardarToken(response.token);
          //no cuenta con el nombre de la sucursal y del rol
          //this._usuario = response.usuario; 
        }),
        map((response: RespuestaAutentificacion) => {
          return response.usuario;
        }),
        /*
        catchError((response)=>{
          return throwError(() => new Error(response.error.msg))
        })
        */
        catchError(this.errorS.handleError)
      )
  }

  retornarPerfil(): Observable<RespuestaPerfil> {
    //el interceptor agrega el token a las rutas de la api 
    return this.http.get<RespuestaPerfil>(`${this.apiUrl}/retornarPerfil`)
      .pipe(
        //dejamos el usuario retornado mediante el token, en el estado global del del perfil de usuario
        tap((response: RespuestaPerfil) => {
          this._usuario = response.usuario;
        }),
        /*
        catchError((response)=>{
          return throwError(() => new Error(response.error.msg))
        })
        */
        catchError(this.errorS.handleError)
      );
  }

  //ingresar y luego devuelver el perfil de usuario
  ingresarRetornarPerfil(correo: string, contra: string) {
    return this.ingresar(correo, contra)
      .pipe(
        switchMap(() => this.retornarPerfil()),//un observable depende de otro
      )
  }

  cerrarSesion() {
    this.tokenService.removerToken();
  }
}
