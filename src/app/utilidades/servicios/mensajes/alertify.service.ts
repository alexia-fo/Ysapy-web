import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

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
                                  //parametros a aceptar
  //aun no esta                   // (evento, valor)
  mensajeConInput(mensaje:string, aceptado:Function, cancelado:Function){
    //mensaje - valor por defecto
    alertify.prompt(mensaje, "", aceptado, cancelado)
  }

  //aun no esta
  mensajeConfirmacion(mensaje:string, aceptado:any){    
    alertify.confirm(mensaje, 
      aceptado, 
      function(){
        alertify.error('Operación Cancelada');
      })
      
  }

  mensajeConOk(mensaje:string, aceptado:Function){
    alertify
    .alert(mensaje, aceptado);
  }

}
