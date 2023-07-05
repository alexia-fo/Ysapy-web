import { Component, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-tabla-serverside',
  templateUrl: './tabla-serverside.component.html',
  styleUrls: ['./tabla-serverside.component.css']
})
export class TablaServersideComponent {
  @Input() dtOptions: DataTables.Settings = {};
 
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective; //para destruir el datatable

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Llamar al método draw para actualizar la tabla
      dtInstance.draw();
    });
  }

  onRowDoubleClick(event: any) {
    // Aquí puedes realizar las acciones que deseas ejecutar al hacer doble clic en una fila
    console.log('Fila seleccionada:', event.target);
  }
}
