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

  /*FIXME:
  Ejecución del Guard: Cuando un usuario intenta cargar un módulo de manera perezosa (por ejemplo, al navegar a una ruta que está asociada con la carga del módulo), el guard canLoad se ejecutará antes de que se intente cargar el módulo.

  retornarPerfil(): La función comienza llamando al método retornarPerfil() del servicio authService. este método se utiliza para obtener el perfil de usuario actuaal mediante el token almacenado en el local storage.

  pipe y Operadores Observables:

  pipe se utiliza para encadenar operadores Observable, lo que permite realizar una serie de transformaciones en el flujo de datos que se obtiene del servicio authService.retornarPerfil().
  tap(() => console.log('canActive')): El operador tap se utiliza aquí para realizar una acción secundaria (en este caso, imprimir un mensaje en la consola) sin afectar el flujo de datos principal.
  map: Después del tap, se utiliza el operador map para procesar la respuesta del servicio retornarPerfil(). El objetivo principal es determinar si se debe permitir la carga del módulo.

  Si se obtiene una respuesta exitosa (es decir, respuesta contiene un objeto usuario), se devuelve true. Esto indica que el perfil del usuario se obtuvo correctamente y se permite la carga del módulo.
  Si no se obtiene un perfil de usuario (por ejemplo, respuesta es null o no contiene un objeto usuario), se redirige al usuario a la ruta /perfil y se devuelve false. Esto indica que no se permite la carga del módulo y se redirige al usuario a otra parte de la aplicación.
  catchError: Si ocurre un error durante la obtención del perfil de usuario (por ejemplo, un error de autenticación o de conexión), se maneja utilizando el operador catchError. En este caso, se muestra un mensaje de error a través del servicio mensaje y se redirige al usuario a la ruta /login. 
  Se devuelve false para indicar que no se permite la carga del módulo debido a un error.

  Resultado del Guard: La función canLoad devuelve un valor Observable que emite true o false dependiendo de si se permite o no la carga del módulo. Si el Observable emite true, se permite la carga del módulo; si emite false, se impide la carga y se redirige al usuario a una ruta específica.

  */

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
