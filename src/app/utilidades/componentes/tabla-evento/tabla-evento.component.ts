import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TablaItem } from '../../modelos/modal-buscar.model';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

//! CADA VEZ QUE SE ACTUALIZA EL ARRAY QUE CONTIENE LOS DATOS LISTADOS, LA INSTANCIA DEL DATATABLE SE DESTRUYE PARA VOLVER A RECONSTRUIRLO CON LOS DATOS ACTUALIZADOS
//! AUN NO SE ESTA UTILIZANDO EN NINGUN COMPONENTE - 
//TODO: NECESITA IMPLEMENTARSE PARA DOCUMENTACION

@Component({
  selector: 'app-tabla-evento',
  templateUrl: './tabla-evento.component.html',
  styleUrls: ['./tabla-evento.component.css']
})
export class TablaEventoComponent<T> {
  @Input() tabla!: TablaItem<T>;
  //enviamos al padre la fila seleccionada
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla!: boolean;
  @Input() dtOpciones!: DataTables.Settings;

  //probando lo que esta en este componente
  @Input() dtEventos!: Subject<any>;
  //probando lo que esta en este componente
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective; //para destruir el datatable

  seleccionarItem(item: T) {
    this.itemSeleccionado.emit(item);
  }

  getPropiedadValor(item: any, propiedad: string): any {
    return item[propiedad];
  }

  renderizar() {
    this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
      dtInstancia.destroy();
    });
  }

}
/*

<!--BUSCAR DATOS-->
<button (click)="mostrarModal()">Mostrar</button>

<app-modal-buscar 
[modalId]="modalId"

[titulo]="'Clasificaciones'"
[tabla]="{ propiedades: ['nombre', 'descripcion'], datos: clasificaciones, campos:['Nombre', 'Descripcion'] }"

(itemSeleccionado)="seleccionarClasificacion($event)"
></app-modal-buscar>

<!--------------TABLA PARA LISTADO--------------->

<button (click)="agregarNuevo()">Nuevo</button>


<app-tabla-paginado
[tabla]="tabla"
[cargandoTabla]="cargandoTabla"
[dtOpciones]="dtOpciones2"
[dtEventos]="dtEventos"
(itemSeleccionado)="mostrarSeleccionado($event)"
></app-tabla-paginado>


<app-tabla-paginado
[tabla]="tabla"
[cargandoTabla]="cargandoTabla"
[dtOpciones]="dtOpciones"
[dtEventos]="dtEventos2"
(itemSeleccionado)="mostrarSeleccionado($event)"
></app-tabla-paginado>


import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { RespuestaUsuarios, Usuario } from 'src/app/administracion/modelos/usuario.model';
import { UsuarioService } from 'src/app/administracion/servicios/usuario.service';
import { TablaPaginadoComponent } from 'src/app/utilidades/componentes/tabla-paginado/tabla-paginado.component';
import { TablaItemPag } from 'src/app/utilidades/modal-buscar.model';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.sass']
})
export class PruebaComponent implements OnInit{

  //usuarios!:Usuario[];

  cargandoTabla=false;
  cargandoTabla2=false;

  //PARA UNA TABLA EN UN COMPONENTE
  
  
// Para que el componente padre PruebaComponent pueda obtener la instancia del dtElement del componente hijo TablaPaginadoComponent y llamar al método renderizar() desde el componente padre, puedes utilizar la técnica de "ViewChild" inversa.
// Aquí te muestro cómo hacerlo:
// En PruebaComponent, importa y utiliza ViewChild para obtener una referencia al componente hijo TablaPaginadoComponent:
  
//PARA UNA TABLA EN UN COMPONENTE
// @ViewChild(TablaPaginadoComponent, { static: false })
// tablaPaginadoComponent!: TablaPaginadoComponent<Usuario>; //para destruir el datatable


//PARA MUCHAS TABLAS EN UN COMPONENTE
@ViewChildren(TablaPaginadoComponent)
tablaPaginadoComponents!: QueryList<TablaPaginadoComponent<Usuario>>;

  //////////////// PARA TABLA BUSCAR

  tabla:TablaItemPag<Usuario>={
    propiedades: ['nombre', 'correo'], 
    datos: [], 
    campos:['Nombre', 'Correo'], 
    tablaId:'TablaPrueba'
  }

 // cargandoDatos=false;

  dtOpciones = {
    paging: true,
    info: true,
    pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 10, // establece la cantidad de registros por página en 10
    language: {
    },
  };

  dtOpciones2 = {
    paging: true,
    info: true,
    pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 10, // establece la cantidad de registros por página en 10

    language: {
    },
  };

  dtEventos: Subject<any> = new Subject<any>(); //Trigger del datatable
  dtEventos2: Subject<any> = new Subject<any>(); //Trigger del datatable

  constructor(
    private servicioUsu: UsuarioService,
    private detectorCambio: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargandoTabla=true;
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.servicioUsu.obtenerUsuarios(100, 1, undefined).subscribe({
      next: (respuesta: RespuestaUsuarios) => {
        this.tabla.datos = respuesta.usuarios;
        this.cargandoTabla=false;
        this.establecerDatos();
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          console.log(error);
        });
      },
    });
  }

  establecerDatos() {
    this.detectorCambio.detectChanges();
    this.dtEventos.next(0);
    this.dtEventos2.next(0);

  }

  //PARA MUCHAS TABLAS EN UN COMPONENTE
  renderizar() {
    this.tablaPaginadoComponents.forEach(tablaPaginadoComponent => {
      tablaPaginadoComponent.renderizar();
    });
  }

  //PARA UNA TABLA EN UN COMPONENTE
  
  // renderizar() {
  //   if (this.tablaPaginadoComponent) {
  //     this.tablaPaginadoComponent.renderizar();
  //   }
  // }
  

  ngOnDestroy(): void {
    this.dtEventos.unsubscribe();
  }

  mostrarSeleccionado($event: any){
    console.log('Seleccionar Clasificacion: ', $event);
  }


  agregarNuevo(){
    //this.cargandoDatos = false;
    this.cargandoTabla = true;
    this.renderizar();
    this.obtenerUsuarios();
  }

  modalId='pruebaMod';

  mostrarModal(){
    $(`#${this.modalId}`).modal('show');
  }

  clasificaciones=[{nombre:'bebidas', descripcion:'Bebidas Alcoholicas'}]

  seleccionarClasificacion($event: any){
    console.log('Seleccionar Clasificacion: ', $event);
  }
  
}



*/