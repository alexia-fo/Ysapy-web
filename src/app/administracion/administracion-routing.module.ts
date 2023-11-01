import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './paginas/usuario/usuario.component';
import { ProductoComponent } from './paginas/producto/producto.component';
import { SucursalComponent } from './paginas/sucursal/sucursal.component';
import { VerCalculosRendicionComponent } from './paginas/ver-calculos-rendicion/ver-calculos-rendicion.component';
import { VerCabecerasInventarioComponent } from './paginas/ver-cabeceras-inventario/ver-cabeceras-inventario.component';
import { VerDetalleRendicionComponent } from './paginas/ver-detalle-rendicion/ver-detalle-rendicion.component';
import { AbmcUsuarioComponent } from './paginas/abmc-usuario/abmc-usuario.component';
import { AbmcProductoComponent } from './paginas/abmc-producto/abmc-producto.component';
import { AbmcSucursalComponent } from './paginas/abmc-sucursal/abmc-sucursal.component';
import { VerRendicionComponent } from './paginas/ver-rendicion/ver-rendicion.component';
import { VerDetalleInventarioComponent } from './paginas/ver-detalle-inventario/ver-detalle-inventario.component';
import { VerDetalleRecepcionComponent } from './paginas/ver-detalle-recepcion/ver-detalle-recepcion.component';
import { VerDetalleSalidaComponent } from './paginas/ver-detalle-salida/ver-detalle-salida.component';
import { ListarRendicionComponent } from './paginas/listar-rendicion/listar-rendicion.component';
import { ListarCalculosRendicionComponent } from './paginas/listar-calculos-rendicion/listar-calculos-rendicion.component';
import { ListarCabecerasInventarioComponent } from './paginas/listar-cabeceras-inventario/listar-cabeceras-inventario.component';
import { InformacionComponent } from './paginas/informacion/informacion.component';
import { ModalCloseGuard } from '../guardianes/modal-close.guard';
import { AbmcInformacionComponent } from './paginas/abmc-informacion/abmc-informacion.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: 'detalleSalida/:idCabecera/:idProducto',
        component: VerDetalleSalidaComponent
      },
      {
        path: 'detalleRecepcion/:idCabecera/:idProducto',
        component: VerDetalleRecepcionComponent
      },
      {
        path: 'detalleRendicion/:idCabecera',
        component: VerDetalleRendicionComponent
      },
      {
        path: 'detalleInvetario/:idCabecera',
        component: VerDetalleInventarioComponent
      },
      {
        path: 'calculoRendicion/:idCabecera',
        component: VerCalculosRendicionComponent
      },
      {
        path: 'verRendicion/:idCabecera',
        component: VerRendicionComponent
      },
      {
        path: 'inventarios',
        component: VerCabecerasInventarioComponent
      },
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'producto',
        component: ProductoComponent
      },
      {
        path: 'sucursal',
        component: SucursalComponent
      },
      {
        path: 'informacion',
        component: InformacionComponent
      },

      //////////////SIN COMPONENTES DE REUTILIZACION/////////////////
      {
        path: 'abmc-informacion',
        component: AbmcInformacionComponent,
        canDeactivate:[ModalCloseGuard]
      },
      {
        path: 'abmc-sucursal',
        component: AbmcSucursalComponent,
        canDeactivate:[ModalCloseGuard]
      },
      {
        path: 'abmc-producto',
        component: AbmcProductoComponent
      },
      {
        path: 'abmc-usuario',
        component: AbmcUsuarioComponent
      },
      {
        path: 'listar-cabeceras',
        component: ListarCabecerasInventarioComponent
      },
      {
        path: 'listar-calculosRendicion/:idCabecera',
        component: ListarCalculosRendicionComponent
      },
      {
        path: 'listar-Rendicion/:idCabecera',
        component: ListarRendicionComponent
      },
      {
        path: '**',
        redirectTo: 'usuario'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
