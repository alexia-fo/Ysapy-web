import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetRecepcion, RecepcionVisualizar, RespuestaDetRecepcion, RespuestaRecepcionesVisualizar, datosCabeceraAmostrar } from '../../modelos/inventariosRegistrados';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';

@Component({
  selector: 'app-ver-recepciones',
  templateUrl: './ver-recepciones.component.html',
  styleUrls: ['./ver-recepciones.component.css']
})
export class VerRecepcionesComponent {
   
  //id de cabecera de inventario
  idCabecera!:number;

  cabecera!:datosCabeceraAmostrar;
  
  detalles:RecepcionVisualizar[]=[];//para la tabla
  
  cargandoDatos=true; //obteniendo los datos
  
  dtOpciones: DataTables.Settings = {
    paging: false,
    info: false,
    responsive: false,
    lengthChange: false,
    order: [[0, 'desc']], // Ordenar por la primera columna (0) en orden ascendente ('asc')
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
  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: InventariosRegistradosService,
    private router: Router,

    private route: ActivatedRoute,
  ){
  }
  ngOnInit(): void {
    this.cargandoDatos=true;
    this.route.params // obtenemos el id de la cabecera desde la url
    .pipe(
      switchMap(params => {
        this.idCabecera = params['idCabecera'];
        return this.servicioC.obtenerRecepciones(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
      })
    )
    .subscribe({
      next: (respuesta: RespuestaRecepcionesVisualizar) => {
        this.detalles=respuesta.dRecepcion;
        this.cabecera=respuesta.cabecera;
        console.log(this.cabecera)
        this.cargandoDatos=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos=false;
      },
    });
  }

  mostrarPdf(){
    this.servicioC.obtenerRecepcionesPDF(this.idCabecera)
    .subscribe({
      next: (respuesta:Blob) => {
        ObtenerPDF.visualizarPDF(respuesta);
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
      },
    });
  }
}
