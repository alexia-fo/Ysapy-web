import { Component, OnInit } from '@angular/core';
import { DatosDetalleRendicion, RespuestaDetalleRendicion } from '../../modelos/inventariosRegistrados';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';

@Component({
  selector: 'app-ver-detalle-rendicion',
  templateUrl: './ver-detalle-rendicion.component.html',
  styleUrls: ['./ver-detalle-rendicion.component.css']
})
export class VerDetalleRendicionComponent implements OnInit{
  //id de cabecera de inventario
  idCabecera!:number;
  
  detalles:DatosDetalleRendicion[]=[]; //para el listado de cabeceras en la tabla
  
  cargandoDatos=true; //cargando datos de cabecera
  
  dtOpciones: DataTables.Settings = {
  // ordering:true,
  ordering:false,
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
  }
  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: InventariosRegistradosService,
    private route: ActivatedRoute,
    private router: Router,
  ){}
  
  ngOnInit(): void {
    this.cargandoDatos=true;
    this.route.params // obtenemos el id de la cabecera desde la url
    .pipe(
      switchMap(params => {
        this.idCabecera = params['idCabecera'];
        return this.servicioC.obtenerDetalleRendicion(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
      })
    )
    .subscribe({
      next: (respuesta: RespuestaDetalleRendicion) => {
        this.detalles=respuesta.detalleRendicion;
        console.log(respuesta)
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

  paginaAnterior(){
    this.router.navigateByUrl(`/administracion/calculoRendicion/${this.idCabecera}`);
  }

  mostrarPdf(){
    this.servicioC.obtenerDetalleRendicionPDF(this.idCabecera)
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
