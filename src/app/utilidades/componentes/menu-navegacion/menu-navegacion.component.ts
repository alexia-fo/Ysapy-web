import { Component, Input } from '@angular/core';
import { MenuItem } from '../../modelos/menu.model';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.css']
})
export class MenuNavegacionComponent {
  @Input() menuItems: MenuItem[]=[];
}
