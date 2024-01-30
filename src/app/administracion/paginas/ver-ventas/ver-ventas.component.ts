import { Component } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetalleInventario, RespuestaDetalleInventario, datosCabeceraAmostrar } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';

@Component({
  selector: 'app-ver-ventas',
  templateUrl: './ver-ventas.component.html',
  styleUrls: ['./ver-ventas.component.css']
})
export class VerVentasComponent {
//id de cabecera de inventario
idCabecera!:number;

cabecera!:datosCabeceraAmostrar;

detalleRendicion!:DatosDetalleInventario[];//para la tabla

cargandoDetalle=true; //obteniendo los datos

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
  private route: ActivatedRoute,
  private router: Router

){
}

ngOnInit(): void {
  this.cargandoDetalle=true;

  this.route.params // obtenemos el id de la cabecera desde la url
  .pipe(
    switchMap(params => {
      this.idCabecera = params['idCabecera'];
      return this.servicioC.obtenerDetalleInventario(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
    })
  )
  .subscribe({
    next: (respuesta: RespuestaDetalleInventario) => {
      this.detalleRendicion=respuesta.detalleInventario;
      this.cabecera=respuesta.cabecera;
      this.cargandoDetalle=false;
    },
    error: (errores) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoDetalle=false;
    },
  });
}

mostrarPdf(){
  this.servicioC.obtenerVentasPDF(this.idCabecera)
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
