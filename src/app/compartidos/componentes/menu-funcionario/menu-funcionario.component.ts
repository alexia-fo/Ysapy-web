import { Component } from '@angular/core';
import { Perfil } from 'src/app/autentificacion/modelos/autentificacion';
import { AutentificacionService } from 'src/app/autentificacion/servicios/autentificacion.service';
import { MenuItem } from 'src/app/utilidades/modelos/menu.model';

@Component({
  selector: 'app-menu-funcionario',
  templateUrl: './menu-funcionario.component.html',
  styleUrls: ['./menu-funcionario.component.css']
})
export class MenuFuncionarioComponent {

  
  usuario!:Perfil;

  menuOptions: MenuItem[] = [
    {
      title: 'Inicio',
      route: '/inicio',
      isDropdown: false
    }
  ];

  constructor(private servicioA: AutentificacionService){}

  ngOnInit(): void {
    this.usuario=this.servicioA.usuario;

    if(this.usuario.Rol.rol=="ROOT"){
      this.menuOptions= [
        {
          title: 'Inicio',
          route: '',
          isDropdown: false
        },
        {
          title: 'ABMC',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Usuario',
              route: '/usuario',
              isDropdown: false
            },
            {
              title: 'Producto',
              route: '/producto',
              isDropdown: false
            },
            {
              title: 'Sucursal',
              route: '/sucursal',
              isDropdown: false
            },
          ]
        },
        // Agrega más opciones de menú aquí según tus necesidades
      ];
    }else if(this.usuario.Rol.rol=="ADMINISTRACION"){
      this.menuOptions = [
        {
          title: 'Inicio',
          route: '/inicio',
          isDropdown: false
        },
        {
          title: 'ABMC',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Usuario',
              route: '/usuario',
              isDropdown: false
            },
            {
              title: 'Producto',
              route: '/producto',
              isDropdown: false
            },
            {
              title: 'Sucursal',
              route: '/sucursal',
              isDropdown: false
            },
          ]
        },
        // Agrega más opciones de menú aquí según tus necesidades
      ];
    }else if(this.usuario.Rol.rol=="FUNCIONARIO"){
      this.menuOptions= [
        {
          title: 'Inicio',
          route: '/inicio',
          isDropdown: false
        },
        {
          title: 'Inventarios',
          route: '/funcionario',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Inventario Apertura',
              route: '/aperturaInventario',
              isDropdown: false
            },
            {
              title: 'Inventario',
              route: '/inventario',
              isDropdown: false
            },
            {
              title: 'Rendicion',
              route: '/rendicion',
              isDropdown: false
            }
          ]
        },
        {
          title: 'Productos',
          route: '/funcionario',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Recepcion',
              route: '/recepcion',
              isDropdown: false
            },
            {
              title: 'Salida',
              route: '/salidaProductos',
              isDropdown: false
            },
          ]
        },
        // Agrega más opciones de menú aquí según tus necesidades
      ];
    }
  }

}
