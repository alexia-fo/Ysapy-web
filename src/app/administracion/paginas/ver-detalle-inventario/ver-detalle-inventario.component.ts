import { Component } from '@angular/core';
import { DatosDetRecepcion, DatosDetSalida, DatosDetalleInventario, RespuestaDetInventario, RespuestaDetRecepcion, RespuestaDetSalida, datosDetInventario } from '../../modelos/ver-calculos-rendicion';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { VerCalculosRendicionService } from '../../servicios/ver-calculos-rendicion.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-ver-detalle-inventario',
  templateUrl: './ver-detalle-inventario.component.html',
  styleUrls: ['./ver-detalle-inventario.component.css']
})
export class VerDetalleInventarioComponent {
  idCabecera!:number;
  detalleInventario!:datosDetInventario[];

  modDetalleRec='detalleRecep';
  modDetalleSalida='detalleSalida';

  detalleRecepcion!:DatosDetRecepcion[];
  detalleSalida!:DatosDetSalida[];

  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: VerCalculosRendicionService,
    private route: ActivatedRoute
  ){
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          this.idCabecera = params['idCabecera'];
          return this.servicioC.obtenerDetalleInventario(this.idCabecera);
        })
      )
      .subscribe({
        next: (respuesta: RespuestaDetInventario) => {
          this.detalleInventario=respuesta.detalleInventario;
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        },
      });
  }

  verDetalleRecep(idProducto:number){
    console.log('recepcion')
    this.servicioC.obtenerDetalleRecepcion(this.idCabecera, idProducto).subscribe({
      next: (respuesta: RespuestaDetRecepcion) => {
        this.detalleRecepcion=respuesta.dRecepcion;
        this.mostrarModal(this.modDetalleRec, true);
        console.log(respuesta)
        //this.cargandoOperacion = false;
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        //this.cargandoOperacion = false;
      },
    });
  }

  verDetalleSalida(idProducto:number){
    console.log('salida')

    this.servicioC.obtenerDetalleSalida(this.idCabecera, idProducto).subscribe({
      next: (respuesta: RespuestaDetSalida) => {
        this.detalleSalida=respuesta.dSalida;
        this.mostrarModal(this.modDetalleSalida, true);
        //this.cargandoOperacion = false;
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        //this.cargandoOperacion = false;
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


}
