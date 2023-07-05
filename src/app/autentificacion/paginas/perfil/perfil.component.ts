import { Component } from '@angular/core';
import { Perfil } from '../../modelos/autentificacion';
import { environment } from 'src/environments/environment.prod';
import { AutentificacionService } from '../../servicios/autentificacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  usuario!:Perfil;

  //------IMAGEN DE USARIO---//
  apiUrl = `${environment.API_URL}/api/uploads/usuarios/`; //ruta del API (se usa para mostrar la imagen actual de un producto seleccinado para modificar)


  constructor(private servicioA: AutentificacionService){}

  ngOnInit(): void {
    this.usuario=this.servicioA.usuario;
  }
}
