import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TablaItemPag } from '../../modelos/modal-buscar.model';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-tabla-evento',
  templateUrl: './tabla-evento.component.html',
  styleUrls: ['./tabla-evento.component.css']
})
export class TablaEventoComponent<T> {
  @Input() tabla!: TablaItemPag<T>;

  //utilizamos desde el componente padre pq depende de cada caso
  @Input() cargandoTabla!: boolean;

  @Input() dtOpciones!: DataTables.Settings;

  //enviamos al padre la fila seleccionada
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();

  //probando lo que esta en este componente
  @Input() dtEventos!: Subject<any>;

  //probando lo que esta en este componente
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective; //para destruir el datatable


  seleccionarItem(item: T) {
    console.log('seleccionar item: ', item);
    this.itemSeleccionado.emit(item);
  }

  getPropiedadValor(item: any, propiedad: string): any {
    return item[propiedad];
  }

 /* 
  public renderizar() {
    const tableIdToDestroy = this.tabla.tablaId; // Identificador de la instancia a destruir

    this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
      const instanciaADestruir = dtInstancia.tables({
        tableId: tableIdToDestroy,
      });
      
      if (instanciaADestruir && instanciaADestruir.length > 0) {
        instanciaADestruir.destroy();
      }
    });
  }
  
  */

  renderizar() {
    this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
      dtInstancia.destroy();
    });
  }

}
