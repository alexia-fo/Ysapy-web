import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetalleInventario, RespuestaDetalleInventario } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-ver-detalle-inventario',
  templateUrl: './ver-detalle-inventario.component.html',
  styleUrls: ['./ver-detalle-inventario.component.css']
})
export class VerDetalleInventarioComponent implements OnInit {
//id de cabecera de inventario
idCabecera!:number;

detalleRendicion!:DatosDetalleInventario[];//para la tabla

cargandoDetalle=true; //obteniendo los datos

dtOpciones: DataTables.Settings = {
  paging: false,
  info: false,
  responsive: true,
  lengthChange: false,
  order: [[0, 'desc']], // Ordenar por la primera columna (0) en orden ascendente ('asc')
  language: {

  },
  initComplete: () => {
    $('table').on('click', '[id^="btnRecepcion_"]', (event) => {
      const idProducto = event.currentTarget.id.split('_')[1];
      //  [routerLink]="['/detalles-recepcion', idCabecera, idProducto]">
      this.router.navigateByUrl(`/administracion/detalleRecepcion/${this.idCabecera}/${idProducto}`);
    });
    
    $('table').on('click', '[id^="btnSalida_"]', (event) => {
      const idProducto = event.currentTarget.id.split('_')[1];
      this.router.navigateByUrl(`/administracion/detalleSalida/${this.idCabecera}/${idProducto}`);
    });
  }
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

paginaAnterior(){
  this.router.navigateByUrl(`/administracion/calculoRendicion/${this.idCabecera}`);
}

}
