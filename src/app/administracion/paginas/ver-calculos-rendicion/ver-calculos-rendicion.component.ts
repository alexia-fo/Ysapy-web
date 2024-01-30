import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { RespuestaCalculos, datosCabeceraAmostrar } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-ver-calculos-rendicion',
  templateUrl: './ver-calculos-rendicion.component.html',
  styleUrls: ['./ver-calculos-rendicion.component.css']
})
export class VerCalculosRendicionComponent implements OnInit{

  //id de cabecera de inventario
  idCabecera!:number;

  //solo se obtienen los totales
  calculoRendicion!:RespuestaCalculos;
  cabecera!:datosCabeceraAmostrar;

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
          return this.servicioC.obtenerCalculos(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
        })
      )
      .subscribe({
        next: (respuesta: RespuestaCalculos) => {
          this.calculoRendicion=respuesta;
          this.cabecera=respuesta.cabecera;
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        },
      });
  }
}
