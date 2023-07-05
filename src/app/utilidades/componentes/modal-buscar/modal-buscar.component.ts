import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem } from '../../modelos/modal-buscar.model';

@Component({
  selector: 'app-modal-buscar',
  templateUrl: './modal-buscar.component.html',
  styleUrls: ['./modal-buscar.component.css']
})
export class ModalBuscarComponent<T> {
  @Input() modalId: string='';
  @Input() titulo: string='';
  @Input() tabla!: TablaItem<T>;
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();

  dtOpciones: DataTables.Settings = {//configuracion del datatable
    paging: true,
    info: true,
    pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    /*
    lengthMenu: [5, 10, 15, 20],//habilita el selector de cantidad de registros con los siguiente numeros (lengthChange: false --> debe quitarse para que funcione)
    */
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 10, // establece la cantidad de registros por página en 10

    language: { //traducimos porque por defecto esta en ingles
      search: 'Buscar:',
      zeroRecords: 'No se encontraron resultados',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 a 0 de 0 registros',
      infoFiltered: '(filtrados de _MAX_ registros en total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      emptyTable: 'No hay datos disponibles en la tabla',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior',
      },
    },
  };

  seleccionarItem(item: T) {
    console.log('seleccionar item: ', item)
    this.itemSeleccionado.emit(item);
  }

  getPropiedadValor(item: any, propiedad: string): any {
    const propiedades = propiedad.split('.'); 
  
    let valor = item;
    for (const prop of propiedades) {
      valor = valor[prop];
    }
  
    return valor;
  }
}
