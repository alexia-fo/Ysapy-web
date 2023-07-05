import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
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
