import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { DatosDetRecepcion, DatosDetSalida, RespuestaDetRecepcion, RespuestaDetSalida, RespuestaRendicion } from '../../modelos/inventariosRegistrados';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { UsuarioService } from '../../servicios/usuario.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-ver-rendicion',
  templateUrl: './ver-rendicion.component.html',
  styleUrls: ['./ver-rendicion.component.css']
})
export class VerRendicionComponent {
  idCabecera!:number;

  constructor(
    private route: ActivatedRoute,
  ){
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.idCabecera = params['idCabecera'];
      });
  }
  
}
