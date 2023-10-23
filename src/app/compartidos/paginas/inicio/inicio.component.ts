import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InformacionesService } from '../../servicios/informaciones.service';
import { Informacion, RespuestaInformaciones } from '../../modelos/informaciones.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  obteniendoDatos=true;
  datos:Informacion[]=[];

  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioI:InformacionesService,
  ) {
  }

  ngOnInit(): void {
    this.obtenerInformaciones();
  }

  obtenerInformaciones() {
    this.obteniendoDatos=true;
    this.servicioI.obtenerInformaciones().subscribe({
      next: (respuesta: RespuestaInformaciones) => {
        console.log(respuesta)
        this.datos = respuesta.informacion;
        console.log(this.datos)
        this.obteniendoDatos = false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.obteniendoDatos=false;
      },
    });
  }
}
