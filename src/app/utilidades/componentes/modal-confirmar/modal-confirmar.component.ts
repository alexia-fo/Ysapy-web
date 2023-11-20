import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertifyService } from '../../servicios/mensajes/alertify.service';

@Component({
  selector: 'app-modal-confirmar',
  templateUrl: './modal-confirmar.component.html',
  styleUrls: ['./modal-confirmar.component.css']
})
export class ModalConfirmarComponent {
  @Input() idModal: string = '';//Proporciona un identificador único para el modal.

  @Output() guardarClick: EventEmitter<any> = new EventEmitter();
  @Output() eliminarClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private mensajeAlertify: AlertifyService,
  ) {
  }

  guardar() {
    this.guardarClick.emit();
    this.mostrarModal(this.idModal, false);
  }
  eliminar() {
    this.mostrarModal(this.idModal, false);
    this.mensajeAlertify.mensajeError('Operación Cancelada');
  }

    // ------ MODAL DE FORMULARIO ------ //

    mostrarModal(id: string, mostrar:boolean) {
      if(mostrar){
        $(`#${id}`).modal('show');
      }else{
        $(`#${id}`).modal('hide');
      }
    }
  

}
