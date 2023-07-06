import { AbstractControl } from "@angular/forms";
import { map } from "rxjs/operators";
import { UsuarioService } from "../administracion/servicios/usuario.service";
import { ProductoService } from "../administracion/servicios/producto.service";

export class Validaciones{

  //validacion asincrona de nombreUsuario del Usuario
  static validacionCorreo(service:UsuarioService, noBuscar:string | undefined){

    return (control:AbstractControl)=>{
        let nombre = control.value;
        return service.correoHabilitado(nombre)
        .pipe(
          map((response:any)=>{
            if(noBuscar != undefined && control.value == noBuscar){
              return null;
            }
            return response.isAvailable ? null : {not_available:true};
          })
        );
    }
  }

  //Validacion asincrona de nombre del Producto
  static validacionProducto(service:ProductoService, noBuscar:string | undefined){

    return (control:AbstractControl)=>{
        let nombre = control.value;
        return service.productoHabilitado(nombre)
        .pipe(
          map((response:any)=>{
            if(noBuscar != undefined && control.value == noBuscar){
              return null;
            }
            return response.isAvailable ? null : {not_available:true};
          })
        );
    }
  }

}

















