import { AbstractControl } from "@angular/forms";
import { map } from "rxjs/operators";
import { UsuarioService } from "../administracion/servicios/usuario.service";
import { ProductoService } from "../administracion/servicios/producto.service";

export class Validaciones{

  //!validacion asincrona del correo en la creacion y edicion de usuarios en el modulo administracion (disponibilidad de un nombre de usuario en una base de datos)
  /*FIXME:La función validacionCorreo toma dos argumentos: service y noBuscar.

  service es una instancia de un servicio de usuario (UsuarioService) que se utiliza para realizar la validación asincrónica. Este servicio tiene un método correoHabilitado que verifica la disponibilidad del correo electrónico.

  noBuscar es una cadena opcional que representa un valor de correo electrónico que no se debe buscar en la validación. Por ejemplo, cuando se edita un usuario existente y no se quiere que el valor actual del correo electrónico cause un conflicto de disponibilidad.
  Cuando se va a crear se envia el parametro noBuscar como undefined y si se va a editar tiene como valor el correo del usuario a editar.. para obviarlo en a validacion

  La función validacionCorreo devuelve una función que toma un argumento control, que representa el campo del formulario que se está validando.

  Dentro de la función devuelta, se obtiene el valor del campo de formulario nombre (correo electrónico) utilizando control.value.

  Luego, se llama al método correoHabilitado del servicio service con el valor del correo electrónico nombre. 

  Se utiliza el operador pipe para manipular la respuesta asincrónica del servicio. Dentro del operador pipe, se utiliza el operador map para transformar la respuesta del servicio en un objeto que representa un error o nulo, 
  según si el correo electrónico está disponible o no.

  En la función map, se verifica si noBuscar está definido y si el valor actual del campo de formulario control.value es igual a noBuscar. Si es igual, significa que el correo electrónico no ha cambiado y no se considera no disponible. 
  En este caso, se devuelve null, lo que significa que la validación ha tenido éxito.

  Si noBuscar no está definido o si el valor del correo electrónico es diferente de noBuscar, se verifica la propiedad isAvailable en la respuesta del servicio. Si isAvailable es true, significa que el correo electrónico está disponible, 
  por lo que se devuelve null (validación exitosa). Si isAvailable es false, se devuelve un objeto de error con la propiedad not_available establecida en true, lo que indica que el correo electrónico no está disponible.
 
 
  */
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

  //!Validacion asincrona de nombre en la creacion y edicion de productos en el modulo administracion
  /*
    FIXME: Tiene la misma funcionalidad que la validacion del correo de un usuario
  */
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

















