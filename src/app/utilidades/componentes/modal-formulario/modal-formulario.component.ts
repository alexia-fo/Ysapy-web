import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.css']
})
export class ModalFormularioComponent {

  @Input() idModal: string = '';//Proporciona un identificador único para el modal.
  @Input() titulo: string = '';//Define el título que se mostrará en la parte superior del modal.
  @Input() accion: string = '';//Puede ser utilizado para especificar el tipo de acción que se realizará en el modal, como "Crear" o "Modificar" para adaptar el texto del boton en base a ello.
  @Input() modalTamaño:'pequeño' | 'mediano'| 'largo' | 'extraLargo' | 'pantallaCompleta' | ''=''; //Permite especificar el tamaño del modal, que puede ser 'pequeño', 'mediano', 'largo', 'extraLargo', 'pantallaCompleta' o una cadena vacía por defecto.

  /*FIXME:
    guardarClick: Un evento que se emite cuando se hace clic en el botón "Guardar". 
    Esto permite que el componente padre reaccione a este evento y realice alguna acción.
    
    eliminarClick: Un evento que se emite cuando se hace clic en el botón "Eliminar". 
    Al igual que el evento anterior, permite que el componente padre maneje esta acción.
  */
  @Output() guardarClick: EventEmitter<any> = new EventEmitter();
  @Output() eliminarClick: EventEmitter<any> = new EventEmitter();

  /*FIXME:
    Permite deshabilitar los botones de acción (Guardar y Eliminar) cuando se está realizando una 
    operación CRUD para evitar que se realicen múltiples acciones simultáneas.
  */
  @Input() cargandoOperacion: boolean = false;

  /*FIXME:
    Estos métodos se llaman cuando se hace clic en los botones "Guardar" y "Eliminar", respectivamente. 
    Emiten los eventos guardarClick y eliminarClick, lo que permite que el componente padre maneje la lógica 
    de guardar o eliminar los datos.
  */
  guardar() {
    this.guardarClick.emit();
  }
  eliminar() {
    this.eliminarClick.emit();
  }

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
