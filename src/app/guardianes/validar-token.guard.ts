import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { AutentificacionService } from '../autentificacion/servicios/autentificacion.service';
import { AlertifyService } from '../utilidades/servicios/mensajes/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  constructor(
    private authService:AutentificacionService,
    private router:Router,
    private mensaje: AlertifyService
  ){}
  
  canActivate():Observable<boolean> | boolean {
    
    return this.authService.retornarPerfil().pipe(
      tap(()=>console.log('canActive')),
      map((respuesta: any) => {
        if (respuesta && respuesta.usuario) {
          return true; // El perfil del usuario se obtuvo correctamente
        } else {
          this.mensaje.mensajeError(`No esta autenticado`);
          return false;
        }
      }),
      catchError(() => {
        this.mensaje.mensajeError(
          `Error de autentificacion`
        );
        this.router.navigate(['autentificacion']); // Redirigir a una ruta específica en caso de error de conexión
        return of(false);
      })
    );
  }

  canLoad():Observable<boolean> | boolean{
    
    return this.authService.retornarPerfil().pipe(
      tap(()=>console.log('canActive')),
      map((respuesta: any) => {
        if (respuesta && respuesta.usuario) {
          return true; // El perfil del usuario se obtuvo correctamente
        } else {
          this.router.navigate(['/perfil']); // Redirigir a una ruta específica si no se obtiene el perfil
          return false;
        }
      }),
      catchError(() => {
        this.mensaje.mensajeError(
          `$Error de autentificacion`
        );
        this.router.navigate(['/login']); // Redirigir a una ruta específica en caso de error de conexión
        return of(false);
      })
    );
  }
}
