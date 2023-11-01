import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
/*
El método canDeactivate realiza lo siguiente:

Verifica si existen elementos en el DOM con la clase CSS .modal utilizando jQuery. Esto se hace con $('.modal').length, que verifica cuántos 
elementos tienen la clase .modal. Si se encuentra al menos uno, se asume que hay un modal abierto.
Si se encuentra al menos un modal abierto, se ejecuta $('.modal').modal('hide'), que utiliza jQuery para cerrar todos los modales abiertos en 
la página. Esto es útil para asegurarse de que los modales se cierren antes de cambiar de ruta.
Se devuelve true al final, lo que indica que la navegación está permitida. Si no se encuentra ningún modal abierto, el guardia no afecta la navegación 
y devuelve true.
*/
@Injectable({
  providedIn: 'root'
})
export class ModalCloseGuard implements CanDeactivate<any> {
  constructor() {}

  canDeactivate(): boolean {
        // Verifica si existen elementos con la clase .modal en el DOM
        if ($('.modal').length > 0) {
          // Cierra todos los modales abiertos utilizando jQuery
          console.log("Existen modales abiertos")
          $('.modal').modal('hide');
        }else{
          console.log("No Existen modales abiertos")

        }
        
    return true;
  }
}
