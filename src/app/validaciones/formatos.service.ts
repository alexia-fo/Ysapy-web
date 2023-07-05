import { Injectable } from '@angular/core';
import { AbstractControl,ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  constructor() { }

  //validacion de correo electronico en usuario
  esCorreoInvalido(control:AbstractControl){
      let email = control.value;
      if(email){
        let e = email.split("@");
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if(!re.test(email)){
        return {isEmailInvalid:true}
      }
      if(!/^[a-zA-Z().]+$/.test(e[1])){
         return {isEmailInvalid:true}
      }
    }
    return null;
  }

  //para confirmar contrasenia al modificar contraseña de usuario y al guardar nuevo usuario
  camposIguales(field1:string, field2:string){
    return (formGroup:AbstractControl):ValidationErrors | null=>{

      const pass1=formGroup.get(field1)?.value;
      const pass2=formGroup.get(field2)?.value;
      if(pass1!==pass2){
        //le agregamos el error al campo porque al construir el formulario solo se le asigna el required
        //por lo que el error no se mostrara si no le añadimos la validacion
        formGroup.get(field2)?.setErrors({notEquals:true})
        return{
          notEquals:true
        }
      }

      ///tener cuidado si es que se agregan otras validaciones.. ya que les quitara los errores si existen
      formGroup.get(field2)?.setErrors(null);

      return null;
    }
  }

  //para validar el formato de la imagen en usuario y producto
  /*
  validarFormatoImagen(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value ;
    if (!archivo) {
      return null;
    }
    console.log(archivo.name)
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const extension = archivo.split('.').pop();
    const formatoValido = allowedExtensions.test(`.${extension}`);
    return formatoValido ? null : { formatoInvalido: true };
  }*/
  
  /*
    Para permitir solo extensiones en minúsculas en la expresión regular 
    allowedExtensions, puedes eliminar la opción i después de la expresión 
    regular. La opción i indica que la coincidencia de la expresión regular no distingue 
    entre mayúsculas y minúsculas. Aquí está el código actualizado:
  */

  validarFormatoImagen(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value ;
    if (!archivo) {
      return null;
    }
    console.log(archivo.name)
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/;
    const extension = archivo.split('.').pop();
    const formatoValido = allowedExtensions.test(`.${extension}`);
    return formatoValido ? null : { formatoInvalido: true };
  }
  
}
