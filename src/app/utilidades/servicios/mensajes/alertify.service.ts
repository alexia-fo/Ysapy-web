import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})

export class AlertifyService {

  constructor() {
    // Configura las opciones globales de alertify para quitar el título
    // alertify.set('notifier', 'position', 'top-center');
    // alertify.set('notifier', 'delay', 5);
    // alertify.set()
  }

  // constructor() { }
  //!Se utilizan en todos los componentes
  /*
  Esta clase se utiliza para mostrar notificaciones o mensajes al usuario utilizando la biblioteca externa alertifyjs.
  Cada uno de estos métodos toma un parámetro mensaje, que es la cadena de texto que se mostrará como mensaje al usuario.
  */

  mensajeNormal(mensaje: string){
    alertify.message(mensaje);
  }

  mensajeAlerta(mensaje: string){
    alertify.warning(mensaje);
  }

  mensajeError(mensaje: string){
    alertify.error(mensaje);
  }

  mensajeExito(mensaje:string){
    alertify.success(mensaje);
  }

  mensajeConfirmacion(mensaje:string, aceptado:any){    
    alertify.confirm(mensaje, 
      aceptado, 
      function(){
        alertify.error('Operación Cancelada');
      })
      
  }

}
