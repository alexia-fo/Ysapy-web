import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalidaPaginaGuard implements CanDeactivate<any> {
  constructor() {}

  // ... otros métodos y propiedades del componente

  canDeactivate(): boolean | Observable<boolean> {
    // Lógica para determinar si el usuario puede salir del componente
    // Puedes devolver un valor booleano o un Observable<boolean>
    // console.log('ejecutando can deactive')
    let salir=window.confirm('Desea salir de la página actual ? Si ha agregado datos sin enviar y presiona ACEPTAR, los mismos se borrarán');
    return salir;
  }
}
