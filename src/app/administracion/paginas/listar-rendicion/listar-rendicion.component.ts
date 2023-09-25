import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaDetRecepcion, RespuestaDetSalida, RespuestaRendicion } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { UsuarioService } from '../../servicios/usuario.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-listar-rendicion',
  templateUrl: './listar-rendicion.component.html',
  styleUrls: ['./listar-rendicion.component.css']
})
export class ListarRendicionComponent {
  idCabecera!:number;
  detalleRendicion!:RespuestaRendicion;

  modDetalleI='detalleI';
  modDetalleR='detalleR';

  //temporal
  modDetalleRec='detalleRecep';
  modDetalleSalida='detalleSalida';
  detalleRecepcion!:DatosDetRecepcion[];
  detalleSalida!:DatosDetSalida[];

  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: InventariosRegistradosService,
    private route: ActivatedRoute,
    private servicioU: UsuarioService
  ){
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          this.idCabecera = params['idCabecera'];
          return this.servicioC.obtenerRendicion(this.idCabecera);
        })
      )
      .subscribe({
        next: (respuesta: RespuestaRendicion) => {
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
