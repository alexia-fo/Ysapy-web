import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.css']
})
export class ModalFormularioComponent {

  @Input() idModal: string = '';
  @Input() titulo: string = '';
  @Input() accion: string = '';
  //este aun no se si es necesario
  //@Input() formInstanciado:boolean=false;


  // Definir eventos personalizados
  @Output() guardarClick: EventEmitter<any> = new EventEmitter();
  @Output() eliminarClick: EventEmitter<any> = new EventEmitter();

  //para deshabilitar botones al generar una operacion crud
  @Input() cargandoOperacion: boolean = false;

  guardar() {
    console.log('Guardar presionado..')
    this.guardarClick.emit();
  }

  eliminar() {
    console.log('Eliminar presionado..')
    this.eliminarClick.emit();
  }
}
