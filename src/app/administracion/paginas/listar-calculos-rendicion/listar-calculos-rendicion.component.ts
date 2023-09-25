import { Component } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaCalculosRendicion, RespuestaDetRecepcion, RespuestaDetSalida } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-listar-calculos-rendicion',
  templateUrl: './listar-calculos-rendicion.component.html',
  styleUrls: ['./listar-calculos-rendicion.component.css']
})
export class ListarCalculosRendicionComponent {
  


  //id de cabecera de inventario
  idCabecera!:number;

  //la cabecera, y los detalle de inventario y rendicion se obtienen con una peticion 
  calculoRendicion!:RespuestaCalculosRendicion;

  //modal detalle de inventario de productos
  modDetalleI='detalleI';
  //modal detalle de rendicion caja
  modDetalleR='detalleR';
  //modal detalle de recepcion de productos
  modDetalleRec='detalleRecep';
  //modal detalle de salida de productos
  modDetalleSalida='detalleSalida';

  //una vez seleccionado el producto se realiza la consulta de recepciones o salidas
  detalleRecepcion!:DatosDetRecepcion[];
  detalleSalida!:DatosDetSalida[];

  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioC: InventariosRegistradosService,
    private route: ActivatedRoute
  ){
  }

  ngOnInit(): void {
    this.route.params // obtenemos el id de la cabecera desde la url
      .pipe(
        switchMap(params => {
          this.idCabecera = params['idCabecera'];
          return this.servicioC.obtenerCalculoRendicion(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
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
