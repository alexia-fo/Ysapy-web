import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AlertifyService } from '../utilidades/servicios/mensajes/alertify.service';
import { AutentificacionService } from '../autentificacion/servicios/autentificacion.service';
/*FIXME:


*/

@Injectable({
  providedIn: 'root'
})
export class ValidarRolesGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AutentificacionService,
    private router: Router,
    private mensaje: AlertifyService
    
    ) {}

    //FIXME:EVALUA UN SOLO TIPO DE ROL
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

  /*FIXME:
  Este guard se utiliza para controlar el acceso a rutas que se cargan de manera perezosa o que requieren autenticación antes de mostrarse.

  Cuando un usuario intenta acceder a una ruta protegida por este guard, se ejecuta canActivate.

  La función toma dos parámetros:

  route: Un objeto ActivatedRouteSnapshot que representa la ruta que se intenta activar.
  state: Un objeto RouterStateSnapshot que representa el estado actual del enrutador.
  La función comienza por verificar si la ruta tiene datos (data) asociados y si contiene una propiedad llamada roles. Estos roles representan los roles de usuario permitidos para acceder a la ruta.

  Luego, utiliza this.authService.retornarPerfil() para obtener el perfil de usuario actual. Esto obtiene la información del usuario y, específicamente, el rol del usuario.

  Después de obtener el rol del usuario, verifica si coincide con alguno de los roles permitidos para la ruta utilizando rolesPermitidos.includes(rolUsuario). Si coincide, permite el acceso devolviendo true. 
  Si no coincide, redirige al usuario a una ruta de autenticación y muestra un mensaje de error.

  Si no se obtiene el perfil del usuario o si ocurre un error durante la verificación, también redirige al usuario a una ruta de autenticación.
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

  /*FIXME:
    Este guard se utiliza para controlar si un módulo puede cargarse de manera perezosa o no. En otras palabras, verifica si el usuario tiene los roles necesarios para cargar un módulo específico.

    Cuando un usuario intenta cargar un módulo protegido por este guard, se ejecuta canLoad.

    La función toma un solo parámetro:

    route: Un objeto Route que representa la ruta que se intenta cargar.
    La lógica de canLoad es similar a la de canActivate. Verifica si la ruta tiene datos (data) asociados y si contiene una propiedad llamada roles, y luego procede a verificar si el rol del usuario coincide con los roles permitidos.

    Si el usuario tiene los roles adecuados, se permite la carga del módulo. De lo contrario, se redirige al usuario a una ruta de autenticación y se muestra un mensaje de error.
  */
  canLoad(route: Route): Observable<boolean> | boolean {
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
  
}

