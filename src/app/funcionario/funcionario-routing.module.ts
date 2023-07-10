import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RendicionCajaComponent } from './paginas/rendicion-caja/rendicion-caja.component';
import { InventarioProductosComponent } from './paginas/inventario-productos/inventario-productos.component';
import { InvRendCabeceraComponent } from './paginas/inv-rend-cabecera/inv-rend-cabecera.component';
import { RecepcionProductosComponent } from './paginas/recepcion-productos/recepcion-productos.component';
import { SalidaProductosComponent } from './paginas/salida-productos/salida-productos.component';

const routes: Routes = [
  {
    path:"",
    component:MainComponent,
    children:[
      {
        path:'salidaProductos',
        component:SalidaProductosComponent
      },
      {
        path:'recepcion',
        component:RecepcionProductosComponent
      },
      {
        path:'rendicion',
        component:RendicionCajaComponent
      },
      {
        path:'inventario',
        component:InventarioProductosComponent
      },
      {
        path:'aperturaInventario',
        component:InvRendCabeceraComponent
      },
      {
        path:'**',
        redirectTo:'usuario'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
