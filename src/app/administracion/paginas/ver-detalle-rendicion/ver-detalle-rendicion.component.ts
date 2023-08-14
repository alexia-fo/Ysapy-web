import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { VerCalculosRendicionService } from '../../servicios/ver-calculos-rendicion.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaDetRecepcion, RespuestaDetSalida, RespuestaDetallesRendicion } from '../../modelos/ver-calculos-rendicion';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-ver-detalle-rendicion',
  templateUrl: './ver-detalle-rendicion.component.html',
  styleUrls: ['./ver-detalle-rendicion.component.css']
})
export class VerDetalleRendicionComponent {
  idCabecera!:number;
  detalleRendicion!:RespuestaDetallesRendicion;

  modDetalleI='detalleI';
  modDetalleR='detalleR';

  //temporal
  modDetalleRec='detalleRecep';
  modDetalleSalida='detalleSalida';
  detalleRecepcion!:DatosDetRecepcion[];
  detalleSalida!:DatosDetSalida[];

  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: VerCalculosRendicionService,
    private route: ActivatedRoute,
    private servicioU: UsuarioService
  ){
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          this.idCabecera = params['idCabecera'];
          return this.servicioC.obtenerDetallesRendicion(this.idCabecera);
        })
      )
      .subscribe({
        next: (respuesta: RespuestaDetallesRendicion) => {
          this.detalleRendicion=respuesta;
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        },
      });
  }

  verDetalleI(){
    this.mostrarModal(this.modDetalleI, true);
  }

  verDetalleR(){
    this.mostrarModal(this.modDetalleR, true);
  }

    // ------ MODAL DE FORMULARIO ------ //

    mostrarModal(id: string, mostrar:boolean) {
      if(mostrar){
        $(`#${id}`).modal('show');
      }else{
        $(`#${id}`).modal('hide');
      }
    }

    ///temporal 
    
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

}
