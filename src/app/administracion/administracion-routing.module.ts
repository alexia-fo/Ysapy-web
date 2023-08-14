import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './paginas/usuario/usuario.component';
import { ProductoComponent } from './paginas/producto/producto.component';
import { SucursalComponent } from './paginas/sucursal/sucursal.component';
import { VerCalculosRendicionComponent } from './paginas/ver-calculos-rendicion/ver-calculos-rendicion.component';
import { VerCabecerasInventarioComponent } from './paginas/ver-cabeceras-inventario/ver-cabeceras-inventario.component';
import { VerDetalleInventarioComponent } from './paginas/ver-detalle-inventario/ver-detalle-inventario.component';
import { VerDetalleRendicionComponent } from './paginas/ver-detalle-rendicion/ver-detalle-rendicion.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
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
        path: 'calculoRendicion/:idCabecera',
        component: VerCalculosRendicionComponent
      },
      {
        path: 'detalleRendicion/:idCabecera',
        component: VerDetalleRendicionComponent
      },
      {
        path: 'detalleInventario/:idCabecera',
        component: VerDetalleInventarioComponent
      },
      {
        path: 'inventarios',
        component: VerCabecerasInventarioComponent
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
