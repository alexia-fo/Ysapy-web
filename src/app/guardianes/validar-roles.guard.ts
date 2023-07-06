import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AlertifyService } from '../utilidades/servicios/mensajes/alertify.service';
import { AutentificacionService } from '../autentificacion/servicios/autentificacion.service';


@Injectable({
  providedIn: 'root'
})
export class ValidarRolesGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AutentificacionService,
    private router: Router,
    private mensaje: AlertifyService
    
    ) {}

    //EVALUA UN SOLO TIPO DE ROL
    /*
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
      const data = route.data; // Obtener el objeto data de la ruta
    
      if (data && data['rol']) {
        const rolPermitido = data['rol']; // Obtener el rol permitido desde los datos de la ruta
        
        return this.authService.retornarPerfil().pipe(
          tap(() => console.log('canActivate')),
          map((respuesta: any) => {
           
            if (respuesta && respuesta.usuario) {
              console.log(respuesta.usuario.Rol.rol)
              const rolUsuario = respuesta.usuario.Rol.rol; // Obtener el rol del usuario desde la respuesta
              // Verificar si el rol del usuario coincide con el rol permitido
              if (rolUsuario == rolPermitido) {
                return true; // Permitir acceso si el rol coincide
              } else {
                this.router.navigate(['/autentificacion']); // Redirigir a una ruta específica si el rol no coincide
                this.mensaje.mensajeError(
                  `El rol no es válido !!`
                );
                return false;
              }
            } else {
              this.mensaje.mensajeError(
                `No está autenticado !!`
              );
              this.router.navigate(['/autentificacion']); // Redirigir a una ruta específica si no se obtiene el perfil
              return false;
            }
          }),
          catchError(() => {
            this.mensaje.mensajeError('Error de autentificacion');
            this.router.navigate(['/autentificacion']); // Redirigir a una ruta específica en caso de error de conexión
            return of(false);
          })
        );
      } else {
        // No se ha definido el rol permitido en los datos de la ruta
        // Manejar el caso según tus necesidades
        this.mensaje.mensajeError(
          `Error al acceder a la pagina !!`
        );
        return of(false);
      }
    }
    */

    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const data = route.data; // Obtener el objeto data de la ruta

    if (data && data['roles']) {
      const rolesPermitidos = data['roles']; // Obtener los roles permitidos desde los datos de la ruta

      return this.authService.retornarPerfil().pipe(
        tap(() => console.log('canActivate')),
        map((respuesta: any) => {
          if (respuesta && respuesta.usuario) {
            const rolUsuario = respuesta.usuario.Rol.rol; // Obtener el rol del usuario desde la respuesta
            // Verificar si el rol del usuario coincide con alguno de los roles permitidos
            if (rolesPermitidos.includes(rolUsuario)) {
              return true; // Permitir acceso si el rol coincide
            } else {
              this.router.navigate(['/autenticacion']); // Redirigir a una ruta específica si el rol no coincide
              this.mensaje.mensajeError('El rol de usuario no es válido');
              return false;
            }
          } else {
            this.mensaje.mensajeError('No está autenticado');
            this.router.navigate(['/autenticacion']); // Redirigir a una ruta específica si no se obtiene el perfil
            return false;
          }
        }),
        catchError(() => {
          this.mensaje.mensajeError('Error de autenticación');
          this.router.navigate(['/autenticacion']); // Redirigir a una ruta específica en caso de error de conexión
          return of(false);
        })
      );
    } else {
      // No se han definido roles permitidos en los datos de la ruta
      // Manejar el caso según tus necesidades
      this.mensaje.mensajeError('Error al acceder a la página');
      return of(false);
    }
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    const data = route.data; // Obtener el objeto data de la ruta
  
    if (data && data['rol']) {
      const rolPermitido = data['rol']; // Obtener el rol permitido desde los datos de la ruta
  
      return this.authService.retornarPerfil().pipe(
        tap(() => console.log('canLoad')),
        map((respuesta: any) => {
          if (respuesta && respuesta.usuario) {
            const rolUsuario = respuesta.usuario.Rol; // Obtener el rol del usuario desde la respuesta
            // Verificar si el rol del usuario coincide con el rol permitido
            if (rolUsuario === rolPermitido) {
              return true; // Permitir acceso si el rol coincide
            } else {
              this.router.navigate(['/perfil']); // Redirigir a una ruta específica si el rol no coincide
              return false;
            }
          } else {
            this.router.navigate(['/perfil']); // Redirigir a una ruta específica si no se obtiene el perfil
            return false;
          }
        }),
        catchError(() => {
          this.mensaje.mensajeError('$Error de autentificacion');
          this.router.navigate(['/login']); // Redirigir a una ruta específica en caso de error de conexión
          return of(false);
        })
      );
    } else {
      // No se ha definido el rol permitido en los datos de la ruta
      // Manejar el caso según tus necesidades
      return of(false);
    }
  }
  
}

