import { Injectable } from '@angular/core';
import { AbstractControl,ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  constructor() { }

  //! validacion de correo electronico en la creacion y edicion de usuario en el modulo administracion
  /*FIXME: La función esCorreoInvalido toma un argumento control, que es el campo de formulario que se está validando.

  Se obtiene el valor del campo control y se almacena en la variable email.

  Se verifica si email tiene un valor (es decir, si no es nulo ni indefinido). Si email no tiene un valor, la función devuelve null, lo que significa que la validación ha tenido éxito y no hay ningún error.

  Si email tiene un valor, se procede a realizar dos validaciones diferentes:

  a. Primera validación: Se utiliza una expresión regular llamada re para verificar si email cumple con un formato de correo electrónico válido (no tienen caracteres especiales ni estructuras inválidas en el formato). 
  Si la dirección de correo electrónico no coincide con el formato válido, se devuelve un objeto de error con la propiedad isEmailInvalid establecida en true.

  b. Segunda validación: Se divide la dirección de correo electrónico email en dos partes utilizando el carácter "@" como separador, y se almacenan en el arreglo e. Luego, se utiliza otra expresión regular para 
  verificar si la parte derecha de la dirección de correo electrónico (el dominio) contiene solo letras, ".", y "(", ")" (es decir, no contiene caracteres especiales no permitidos). Si la parte derecha del correo 
  electrónico no cumple con esta validación, se devuelve un objeto de error con la propiedad isEmailInvalid establecida en true.

  Si ambas validaciones son exitosas (es decir, si la dirección de correo electrónico pasa ambas validaciones), la función devuelve null, lo que significa que la validación ha tenido éxito y no hay ningún error.

  */
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

  //! para confirmar contraseña al modificar contraseña de usuario y al guardar nuevo usuario en el modulo adminsitracion
  /*
  FIXME: La función camposIguales toma dos argumentos: field1 y field2, que representan los nombres de los campos que se deben comparar en el formulario.
 
  Dentro de la función, se define una función anónima que toma un formGroup como argumento. Es una forma de representar un conjunto de campos de un formulario en Angular, 
  y esta función se utiliza para validar ese grupo de campos en particular.

  La función obtiene los valores de los campos field1 y field2 del formGroup utilizando el método get. Esto es útil para acceder a los valores actuales de los campos del formulario.

  Luego, compara los valores de pass1 y pass2 (las contraseñas ingresadas y su confirmación). Si estos valores no son iguales, significa que las contraseñas no coinciden. 
  En ese caso, se agrega un error al campo field2 utilizando setErrors. Esto asegura que se muestre un mensaje de error en el campo de confirmación de contraseña para indicar que 
  las contraseñas no son iguales. Además, la función devuelve un objeto con una propiedad notEquals establecida en true, indicando que la validación ha fallado.

  Si las contraseñas son iguales, se utiliza setErrors(null) para borrar cualquier error previo en el campo field2, en caso de que existiera algún otro error. Esto garantiza que, 
  si se realizaron validaciones adicionales en el campo field2, se eliminen esos errores y se considere válido si las contraseñas coinciden.

  Finalmente, si las contraseñas son iguales, la función devuelve null, indicando que la validación ha tenido éxito y que las contraseñas son iguales.
  */
  camposIguales(field1:string, field2:string){
    return (formGroup:AbstractControl):ValidationErrors | null=>{

      const pass1=formGroup.get(field1)?.value;
      const pass2=formGroup.get(field2)?.value;
      if(pass1!==pass2){
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

  //! para validar el formato de la edicion de imagen de usuario y producto en el modulo Administracion
  /*FIXME: La función validarFormatoImagen toma un argumento control, que es el campo de formulario que se está validando.

  La función comienza comprobando si el valor del campo control (que debería ser el archivo de imagen) está presente. Si el valor es nulo o no está definido, se considera que 
  no hay un archivo cargado, por lo que devuelve null, lo que significa que la validación ha tenido éxito y no hay ningún error.

  Si el valor del campo control no es nulo, se valida el formato de la imagen. Se define una expresión regular llamada allowedExtensions, que contiene las extensiones de archivo 
  permitidas para imágenes. En este caso, se permiten archivos con extensiones .jpg, .jpeg, .png y .gif.

  Luego, se extrae la extensión del archivo del valor del campo control utilizando el método split('.') y pop(). Esto se hace para obtener la extensión del archivo, 
  que se asume que está al final del nombre del archivo.
  -El método split() divide un objeto de tipo String en un array (vector) de cadenas mediante la separación de la cadena en subcadenas.
  -El método pop() elimina el último elemento de un array y lo devuelve.

  A continuación, se verifica si la extensión del archivo coincide con alguna de las extensiones permitidas definidas en la expresión regular allowedExtensions. Esto se hace utilizando 
  el método test() de la expresión regular. Si el formato del archivo es válido según las extensiones permitidas, formatoValido se establecerá en true.

  Finalmente, la función devuelve null si el formato del archivo es válido (formatoValido es true), lo que significa que la validación ha tenido éxito y no hay ningún error. Si el formato del archivo no es válido según las extensiones permitidas, la función devuelve un objeto de error con la propiedad formatoInvalido establecida en true, lo que indica que la validación ha fallado debido a un formato de archivo incorrecto.

  */
  /*
    TODO:
    Para permitir solo extensiones en minúsculas en la expresión regular 
    allowedExtensions, hay qye eliminar la opción i después de la expresión 
    regular. La opción i indica que la coincidencia de la expresión regular no distingue 
    entre mayúsculas y minúsculas. 
  */
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
  validarFormatoImagen(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value ;
    if (!archivo) {
      return null;
    }
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/;
    const extension = archivo.split('.').pop();
    const formatoValido = allowedExtensions.test(`.${extension}`);
    return formatoValido ? null : { formatoInvalido: true };
  }
  
}
