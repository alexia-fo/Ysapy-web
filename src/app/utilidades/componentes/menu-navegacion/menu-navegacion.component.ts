import { Component, Input } from '@angular/core';
import { MenuItem } from '../../modelos/menu.model';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.css']
})
export class MenuNavegacionComponent {

  constructor(
    private servicioAut: AutentificacionService,
    private router: Router // Inyecta el enrutador
  ) {}
  
  @Input() menuItems: MenuItem[]=[];

  cerrarSesion(){
    this.servicioAut.cerrarSesion();

    // Llama a la función para recargar la página
    //window.location.reload();
    this.router.navigate(['/login']); 

  }
}
