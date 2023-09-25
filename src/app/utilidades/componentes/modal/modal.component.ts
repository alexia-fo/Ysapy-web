import { Component, Input } from '@angular/core';

//!Se utiliza para mostrar la ventana que permite cambiar la contraseña de usuario en el modulo Administracion
//!tambien en el modulo funcionario para visualizar los detalles de inventario (como prueba)
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  /*FIXME:
    modalId: Esta propiedad de entrada permite especificar un identificador único para el modal. Puede utilizarse para abrir o manipular el modal mediante código.
    titulo: Esta propiedad de entrada permite establecer un título para el modal.
    modalTamaño: Esta propiedad de entrada permite definir el tamaño del modal. Puede tomar uno de los siguientes valores: 'pequeño', 'mediano', 'largo', 'extraLargo', 'pantallaCompleta', o una cadena vacía '' por defecto si no se especifica ningún tamaño.
    
    Método getModalSizeClass() se utiliza para determinar la clase CSS que debe aplicarse al modal en función del valor de modalTamaño. Dependiendo del valor de modalTamaño, este método devuelve una de las siguientes clases CSS que son comunes en los modales de Bootstrap:
    'modal-sm' para modales pequeños.
    'modal-md' para modales medianos.
    'modal-lg' para modales largos.
    'modal-xl' para modales extra largos.
    'modal-fullscreen' para modales a pantalla completa.
    Una cadena vacía '' si modalTamaño no coincide con ninguno de los tamaños definidos.

  */
  @Input() modalId: string='';
  @Input() titulo='';
  @Input() modalTamaño:'pequeño' | 'mediano'| 'largo' | 'extraLargo' | 'pantallaCompleta' | ''=''; // Agrega el atributo modalSize

  getModalSizeClass(): string {
    switch (this.modalTamaño) {
      case 'pequeño':
        return 'modal-sm';
      case 'mediano':
        return 'modal-md';
      case 'largo':
        return 'modal-lg';
      case 'extraLargo':
        return 'modal-xl';
      case 'pantallaCompleta':
        return 'modal-fullscreen';
      default:
        return ''; // Si el valor no coincide con ninguno de los tamaños definidos, no se aplica ninguna clase
    }
  }
}
