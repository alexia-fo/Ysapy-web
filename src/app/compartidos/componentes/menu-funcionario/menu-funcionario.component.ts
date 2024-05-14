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
            {
              title: 'Informacion',
              route: '/informacion',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Rendiciones',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Inventarios',
              route: '/inventarios',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Pedidos',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            //AGREGADO AHORA//TODO: COMENTADO PARA IMPLEMENTAR 27-03-2024
            {
              title: 'Registrar',
              route: '/registrarPedidos',
              isDropdown: false
            },
            {
              title: 'Ver pedidos Enviados',
              route: '/verPedidosEnviados',
              isDropdown: false
            },
            {
              title: 'Pedido Recibidos',
              route: '/verPedidosRecibidos',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Informes',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Comparacion Inventarios',
              route: '/comparacionInventarios',
              isDropdown: false
            },
            {
              title: 'Comparacion Rendiciones',
              route: '/comparacionRendiciones',
              isDropdown: false
            },
          ]
        },
        
      ];
    }else if(this.usuario.Rol.rol=="ADMINISTRADOR"){
      this.menuOptions= [
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
            {
              title: 'Informacion',
              route: '/informacion',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Rendiciones',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Inventarios',
              route: '/inventarios',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Pedidos',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            //AGREGADO AHORA//TODO: COMENTADO PARA IMPLEMENTAR 27-03-2024
            {
              title: 'Registrar',
              route: '/registrarPedidos',
              isDropdown: false
            },
            {
              title: 'Ver pedidos Enviados',
              route: '/verPedidosEnviados',
              isDropdown: false
            },
            {
              title: 'Pedido Recibidos',
              route: '/verPedidosRecibidos',
              isDropdown: false
            },
          ]
        },
        {
          title: 'Informes',
          route: '/administracion',
          isDropdown: true,
          dropdownItems: [
            {
              title: 'Comparacion Inventarios',
              route: '/comparacionInventarios',
              isDropdown: false
            },
            {
              title: 'Comparacion Rendiciones',
              route: '/comparacionRendiciones',
              isDropdown: false
            },
          ]
        },
      ];
    }else if(this.usuario.Rol.rol=="FUNCIONARIO"){
      if(this.usuario.categoria=="V"){//funcionario de categoria venta v
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
  
          {
            title: 'Pedidos',
            route: '/funcionario/pedidos',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Registrar',
                route: '/registrarPedidos',
                isDropdown: false
              },
              {
                title: 'Ver pedidos Enviados',
                route: '/verPedidosEnviados',
                isDropdown: false
              },
              // {
              //   title: 'Editar Pedidos',
              //   route: '/editarPedidos',
              //   isDropdown: false
              // },
            ]
          },
  
          {          
            title: 'Visualizar',
            route: '/funcionario',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Productos',
                route: '/visualizarProductos',
                isDropdown: false
              },
              // {
              //   title: 'Inventarios',
              //   route: '/visualizarInventarios',
              //   isDropdown: false
              // },
              // {
              //   title: 'Recepciones',
              //   route: '/visualizarRecepciones',
              //   isDropdown: false
              // },
              // {
              //   title: 'Salidas',
              //   route: '/visualizarSalidas',
              //   isDropdown: false
              // },
            ]
          },
          // Agrega más opciones de menú aquí según tus necesidades
          
        ];
      }else if(this.usuario.categoria=="C"){//funcionario de categoria cocina c
        this.menuOptions= [
          {
            title: 'Inicio',
            route: '/inicio',
            isDropdown: false
          },
          {
            title: 'Pedidos',
            route: '/funcionario/pedidos',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Registrar',
                route: '/registrarPedidos',
                isDropdown: false
              },
              {
                title: 'Ver Pedidos Enviados',
                route: '/verPedidosEnviados',
                isDropdown: false
              },
              {
                title: 'Ver Pedidos a Recibidos',
                route: '/verPedidosRecibidos',
                isDropdown: false
              },
              // {
              //   title: 'Editar Pedidos',
              //   route: '/editarPedidos',
              //   isDropdown: false
              // },
            ]
          },
  
          {          
            title: 'Visualizar',
            route: '/funcionario',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Productos',
                route: '/visualizarProductos',
                isDropdown: false
              },
            ]
          },
          // Agrega más opciones de menú aquí según tus necesidades
          
        ];
      }else{//funcionario de categoria fabrica f
        this.menuOptions= [
          {
            title: 'Inicio',
            route: '/inicio',
            isDropdown: false
          },
          {
            title: 'Pedidos',
            route: '/funcionario/pedidos',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Registrar',
                route: '/registrarPedidos',
                isDropdown: false
              },
              {
                title: 'Ver Pedidos Enviados',
                route: '/verPedidosEnviados',
                isDropdown: false
              },
              {
                title: 'Ver Pedidos a Recibidos',
                route: '/verPedidosRecibidos',
                isDropdown: false
              },
              // {
              //   title: 'Editar Pedidos',
              //   route: '/editarPedidos',
              //   isDropdown: false
              // },
            ]
          },
  
          {          
            title: 'Visualizar',
            route: '/funcionario',
            isDropdown: true,
            dropdownItems: [
              {
                title: 'Productos',
                route: '/visualizarProductos',
                isDropdown: false
              },
            ]
          },
          // Agrega más opciones de menú aquí según tus necesidades
          
        ];
      }
    }
  }

}
