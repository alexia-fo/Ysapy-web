import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AutentificacionService } from '../autentificacion/servicios/autentificacion.service';
import { AlertifyService } from '../utilidades/servicios/mensajes/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarCategoriaGuard implements CanActivate {
  constructor(
    private authService: AutentificacionService,
    private router: Router,
    private mensaje: AlertifyService
    
    ) {}

  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const data = route.data; // Obtener el objeto data de la ruta

    if (data && data['categorias']) {
      const categoriasPermitidas = data['categorias']; // Obtener los roles permitidos desde los datos de la ruta

      return this.authService.retornarPerfil().pipe(
        tap(() => console.log('canActivate')),
        map((respuesta: any) => {
          if (respuesta && respuesta.usuario) {
            const categoriaUsuario = respuesta.usuario.categoria; // Obtener el rol del usuario desde la respuesta
            // Verificar si el rol del usuario coincide con alguno de los roles permitidos
            if (categoriasPermitidas.includes(categoriaUsuario)) {
              return true; // Permitir acceso si el rol coincide
            } else {
              this.router.navigate(['/autentificacion/perfil']); // Redirigir a una ruta específica si el rol no coincide
              this.mensaje.mensajeError('La categoria del usuario no es válida');
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

    if (data && data['roles']) {
      const categoriasPermitidas = data['categorias']; // Obtener los roles permitidos desde los datos de la ruta

      return this.authService.retornarPerfil().pipe(
        tap(() => console.log('canActivate')),
        map((respuesta: any) => {
          if (respuesta && respuesta.usuario) {
            const categoriaUsuario = respuesta.usuario.categoria; // Obtener el rol del usuario desde la respuesta
            // Verificar si el rol del usuario coincide con alguno de los roles permitidos
            if (categoriasPermitidas.includes(categoriaUsuario)) {
              return true; // Permitir acceso si el rol coincide
            } else {
              this.router.navigate(['/autentificacion/perfil']); // Redirigir a una ruta específica si el rol no coincide
              this.mensaje.mensajeError('La categoria del usuario no es válida');
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
