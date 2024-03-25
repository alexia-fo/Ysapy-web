import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RendicionCajaComponent } from './paginas/rendicion-caja/rendicion-caja.component';
import { InventarioProductosComponent } from './paginas/inventario-productos/inventario-productos.component';
import { InvRendCabeceraComponent } from './paginas/inv-rend-cabecera/inv-rend-cabecera.component';
import { RecepcionProductosComponent } from './paginas/recepcion-productos/recepcion-productos.component';
import { SalidaProductosComponent } from './paginas/salida-productos/salida-productos.component';
import { VisualizarInventariosComponent } from './paginas/visualizar-inventarios/visualizar-inventarios.component';
import { VisualizarRecepcionesComponent } from './paginas/visualizar-recepciones/visualizar-recepciones.component';
import { VisualizarSalidasComponent } from './paginas/visualizar-salidas/visualizar-salidas.component';
import { VerProductosComponent } from './paginas/ver-productos/ver-productos.component';
import { ModalCloseGuard } from '../guardianes/modal-close.guard';
import { SalidaPaginaGuard } from '../guardianes/salida-pagina.guard';
import { RegistroMegasComponent } from './paginas/registro-megas/registro-megas.component';
import { RegistrarPedidosComponent } from './paginas/pedidos-funcionarios/registrar-pedidos/registrar-pedidos.component';
import { VerPedidosEnviadosComponent } from './paginas/pedidos-funcionarios/ver-pedidos-enviados/ver-pedidos-enviados.component';
import { VerPedidosRecibidosComponent } from './paginas/pedidos-funcionarios/ver-pedidos-recibidos/ver-pedidos-recibidos.component';
import { ValidarCategoriaGuard } from '../guardianes/validar-categoria.guard';
import { EditarPedidosComponent } from './paginas/pedidos-funcionarios/editar-pedidos/editar-pedidos.component';

const routes: Routes = [
  {
    path:"",
    component:MainComponent,
    children:[
      {
        path:'visualizarProductos',
        component:VerProductosComponent,
        canDeactivate: [ModalCloseGuard]

      },
      //FIXME: DESHABILITADO POR AHORA
      // {
      //   path:'visualizarInventarios',
      //   component:VisualizarInventariosComponent
      // },
      // {
      //   path:'visualizarRecepciones',
      //   component:VisualizarRecepcionesComponent
      // },
      // {
      //   path:'visualizarSalidas',
      //   component:VisualizarSalidasComponent
      // },
      {
        path:'salidaProductos',
        component:SalidaProductosComponent,
        canDeactivate: [ModalCloseGuard],

        //agregado para que solo ingresen los cajeros
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['V']
        }
      },
      {
        path:'recepcion',
        component:RecepcionProductosComponent,
        canDeactivate: [ModalCloseGuard],

        
        //agregado para que solo ingresen los cajeros
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['V']
        }

      },
      {
        path:'rendicion',
        component:RendicionCajaComponent,
        canDeactivate: [ModalCloseGuard],/* SalidaPaginaGuard */

        //agregado para que solo ingresen los cajeros
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['V']
        }
      },
      {
        path:'inventario',
        component:InventarioProductosComponent,
        canDeactivate: [ModalCloseGuard],/* SalidaPaginaGuard */
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['V']
        }
      },
      {
        path:'aperturaInventario',
        component:InvRendCabeceraComponent,
        canDeactivate: [ModalCloseGuard],
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['V']
        }
      },
      {
        path:'**',
        redirectTo:'usuario'
      }
    ]
  },

  

  {
    path:"pedidos",
    component:MainComponent,
    children:[
      {
        path:'verPedidosRecibidos',
        component: VerPedidosRecibidosComponent,
        canDeactivate: [ModalCloseGuard],
        canActivate: [ValidarCategoriaGuard],
        data: {
          categorias: ['F', 'C']//solo veran los de cocina y fabrica, porque los de venta no reciben pedidos
        }
      },
      {
        path:'verPedidosEnviados',
        component: VerPedidosEnviadosComponent,
        canDeactivate: [ModalCloseGuard]
        //varan los de cocina, venta, fabrica
      },
      {
        path:'registrarPedidos',
        component:RegistrarPedidosComponent,
        canDeactivate: [ModalCloseGuard]
        //registraran los de cocina, venta, fabrica

      },
      {
        path:'editarPedidos/:idCabecera',
        component:EditarPedidosComponent,
        canDeactivate: [ModalCloseGuard]
        //registraran los de cocina, venta, fabrica

      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
