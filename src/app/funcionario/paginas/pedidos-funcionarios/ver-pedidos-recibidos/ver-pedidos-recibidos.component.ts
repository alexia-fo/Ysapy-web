import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Marca, RespuestaMarcas, RespuestaTurnoPedido, TurnoPedido } from 'src/app/funcionario/modelos/pedido-funcionario';
import { ObtenerPedidosService } from 'src/app/funcionario/servicios/pedidos-funcionarios/obtener-pedidos.service';
import { RegistrarPedidoService } from 'src/app/funcionario/servicios/pedidos-funcionarios/registrar-pedido.service';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';

@Component({
  selector: 'app-ver-pedidos-recibidos',
  templateUrl: './ver-pedidos-recibidos.component.html',
  styleUrls: ['./ver-pedidos-recibidos.component.css']
})
export class VerPedidosRecibidosComponent {

  modalFiltros="modalFiltros";
  
  form!: FormGroup; //formulario para filtrar cabeceras

  dtOpciones: DataTables.Settings = {
    paging: false,
    info: false,
    responsive: false,
    lengthChange: false,
    ordering:false,
    // order: [[0, 'desc']], // Ordenar por la primera columna (0) en orden ascendente ('asc')
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

  fechaHoy!:Date;

  cargandoDatos=true; //cargando datos de cabecera

  obteniendoPDF=false;

  marcas:Marca[]=[];
  turnos:TurnoPedido[]=[];

  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioL: ObtenerPedidosService,
    private servicioR: RegistrarPedidoService,
  ){
    this.obtenerFechas();
  }
  
  ngOnInit(): void {
    //establecer valores por defecto al formulario para obtener los datos iniciales
    this.form=this.formulario.group({
      fecha:[new Date(this.fechaHoy).toISOString().substring(0, 10)],
      codMarca:[null],
      turno:[null],
    });

    // Realiza la consulta incicial para obtener las cabeceras, y las sucursales para la ventana de filtro
    this.cargandoDatos=true;

    forkJoin({
      marcas: this.servicioR.marcas(),
      turnos: this.servicioR.obtenerTurnos()
    }).subscribe({
      next: (result:{marcas:RespuestaMarcas, turnos:RespuestaTurnoPedido}) => {
        this.marcas = result.marcas.marca;
        this.turnos = result.turnos.turno;
        this.cargandoDatos=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos=false;      }
    });


  }

  obtenerFechas() {
    // Obtener la fecha de hoy
    this.fechaHoy = new Date();
  }

  //para filtrar los datos de la cabecera
  buscar(){
    this.obteniendoPDF=true;
    this.mostrarModal(this.modalFiltros, false);

    console.log(this.form.value)

    this.servicioL.verPedidosPorSucursalYmarcaPDF(this.form.value)
    .subscribe({
      next: (respuesta:Blob) => {
        ObtenerPDF.visualizarPDF(respuesta);       
        this.obteniendoPDF=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.obteniendoPDF=false;
      },
    });

  }

  // ------ MODAL DE FORMULARIO ------ //

  mostrarModal(id: string, mostrar:boolean) {
    if(mostrar){
      $(`#${id}`).modal('show');
    }else{
      $(`#${id}`).modal('hide');
    }
  }

  buscar2(){
    this.obteniendoPDF=true;
    this.mostrarModal(this.modalFiltros, false);

    console.log(this.form.value)

    this.servicioL.verTotalPedidosRecibidosPDF(this.form.value)
    .subscribe({
      next: (respuesta:Blob) => {
        ObtenerPDF.visualizarPDF(respuesta);       
        this.obteniendoPDF=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.obteniendoPDF=false;
      },
    });

  }

}
