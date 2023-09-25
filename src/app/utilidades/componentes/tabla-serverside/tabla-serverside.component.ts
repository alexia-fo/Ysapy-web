import { Component, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

//! CADA VEZ QUE SE CAMBIA DE PAGINA EL DATATABLE REALIZA LA PETICION DE LOS DATOS 
//! AUN NO SE ESTA UTILIZANDO EN NINGUN COMPONENTE - 
//TODO: NECESITA IMPLEMENTACION PARA DOCUMENTACION

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

/*
TODO: FALTA PROBAR PARA DOCUMENTAR SU FUNCIONALIDAD

<app-tabla-serverside [dtOptions]="dtOptions" class="row-border hover"></app-tabla-serverside>


import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TablaItem } from 'src/app/utilidades/modal-buscar.model';
import { ClasificacionService } from '../../servicios/producto/clasificacion.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesResponse } from '../../modelos/clasificacion.model';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from 'src/app/mensajes/alertify.service';

@Component({
  selector: 'app-recepcion-productos',
  templateUrl: './recepcion-productos.component.html',
  styleUrls: ['./recepcion-productos.component.sass']
})
export class RecepcionProductosComponent{
  dtOptions: DataTables.Settings = {};

  constructor( private mensajeAlertify: AlertifyService, private servicioC:ClasificacionService){}

  ngOnInit(): void {
    this.dtOptions = {
      serverSide: true,     // Set the flag 
      ajax: (dataTablesParameters: any, callback) => {
        //console.log('dataTablesParameters ', dataTablesParameters)
        this.servicioC.clasificaciones(dataTablesParameters).subscribe({
          next:(resp: any) => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
    
            // Llamar a rerender después de recibir la respuesta y actualizar los datos
            // this.rerender();
          },
          error:(error: any) => {
            // Manejo de errores
            this.mensajeAlertify.mensajeError("Error al obtener los datos");
            // Puedes agregar aquí la lógica para mostrar un mensaje de error al usuario o realizar cualquier otra acción necesaria
          }
      });
      },
      columns: [{
        title: 'ID',
        data: 'idClasificacion'
      }, {
        title: 'Nombre',
        data: 'nombre'
      }]
    };
    
  }
}


*/