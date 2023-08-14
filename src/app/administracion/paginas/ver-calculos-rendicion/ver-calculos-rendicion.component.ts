import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { VerCalculosRendicionService } from '../../servicios/ver-calculos-rendicion.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaCalculosRendicion, RespuestaDetRecepcion, RespuestaDetSalida } from '../../modelos/ver-calculos-rendicion';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-ver-calculos-rendicion',
  templateUrl: './ver-calculos-rendicion.component.html',
  styleUrls: ['./ver-calculos-rendicion.component.css']
})
export class VerCalculosRendicionComponent implements OnInit{
  idCabecera!:number;
  calculoRendicion!:RespuestaCalculosRendicion;

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
    private route: ActivatedRoute
  ){
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          this.idCabecera = params['idCabecera'];
          return this.servicioC.obtenerCalculoRendicion(this.idCabecera);
        })
      )
      .subscribe({
        next: (respuesta: RespuestaCalculosRendicion) => {
          this.calculoRendicion=respuesta;
          console.log(this.calculoRendicion)
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        },
      });
  }

  verDetalleI(){
    console.log('hola')
    this.mostrarModal(this.modDetalleI, true);
  }

  verDetalleR(){
    console.log('hola')
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
