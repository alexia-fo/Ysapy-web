import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaDetRecepcion, RespuestaDetSalida } from '../../modelos/inventariosRegistrados';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
@Component({
  selector: 'app-ver-detalle-salida',
  templateUrl: './ver-detalle-salida.component.html',
  styleUrls: ['./ver-detalle-salida.component.css']
})
export class VerDetalleSalidaComponent {
  //id de cabecera de inventario
  idCabecera!:number;
  //producto recepcionado a ver
  idProducto!:number;
  
  detalles:DatosDetSalida[]=[]; //para la tabla

  cargandoDatos=true; //obteniendo los datos

  dtOpciones: DataTables.Settings = {
    paging: false,
    info: false,
    responsive: true,
    lengthChange: false,
    order: [[0, 'desc']], // Ordenar por la primera columna (0) en orden ascendente ('asc')
    language: {
  
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
        this.idProducto = params['idProducto'];
        return this.servicioC.obtenerDetalleSalida(this.idCabecera, this.idProducto); // una vez que obtenemos el id se realiza la consulta
      })
    )
    .subscribe({
      next: (respuesta: RespuestaDetSalida) => {
        this.detalles=respuesta.dSalida;
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
    this.router.navigateByUrl(`/administracion/detalleInventario/${this.idCabecera}`);
  }
}
