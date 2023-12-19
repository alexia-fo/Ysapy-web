import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './paginas/usuario/usuario.component';
import { ProductoComponent } from './paginas/producto/producto.component';
import { SucursalComponent } from './paginas/sucursal/sucursal.component';
import { VerCalculosRendicionComponent } from './paginas/ver-calculos-rendicion/ver-calculos-rendicion.component';
import { VerCabecerasInventarioComponent } from './paginas/ver-cabeceras-inventario/ver-cabeceras-inventario.component';
import { VerDetalleRendicionComponent } from './paginas/ver-detalle-rendicion/ver-detalle-rendicion.component';
import { VerRendicionComponent } from './paginas/ver-rendicion/ver-rendicion.component';
import { VerDetalleInventarioComponent } from './paginas/ver-detalle-inventario/ver-detalle-inventario.component';
import { VerDetalleRecepcionComponent } from './paginas/ver-detalle-recepcion/ver-detalle-recepcion.component';
import { VerDetalleSalidaComponent } from './paginas/ver-detalle-salida/ver-detalle-salida.component';
import { InformacionComponent } from './paginas/informacion/informacion.component';
import { ModalCloseGuard } from '../guardianes/modal-close.guard';
import { VerSalidasComponent } from './paginas/ver-salidas/ver-salidas.component';
import { VerRecepcionesComponent } from './paginas/ver-recepciones/ver-recepciones.component';
import { VerVentasComponent } from './paginas/ver-ventas/ver-ventas.component';
import { ComparacionInventariosComponent } from './paginas/comparacion-inventarios/comparacion-inventarios.component';
import { EditarInventariosComponent } from './paginas/editar-inventarios/editar-inventarios.component';
import { EditarRecepcionesComponent } from './paginas/editar-recepciones/editar-recepciones.component';
import { EditarSalidasComponent } from './paginas/editar-salidas/editar-salidas.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: 'editarSalidas/:idCabecera',
        component: EditarSalidasComponent
      },
      {
        path: 'editarRecepciones/:idCabecera',
        component: EditarRecepcionesComponent
      },
      {
        path: 'editarInventarios/:idCabecera',
        component: EditarInventariosComponent
      },
      {
        path: 'recepciones/:idCabecera',
        component: VerRecepcionesComponent
      },
      {
        path: 'recepciones/:idCabecera',
        component: VerRecepcionesComponent
      },
      {
        path: 'salidas/:idCabecera',
        component: VerSalidasComponent
      },
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
        path: 'ventas/:idCabecera',
        component: VerVentasComponent
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
        component: VerCabecerasInventarioComponent,
        canDeactivate: [ModalCloseGuard]
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canDeactivate: [ModalCloseGuard]
      },
      {
        path: 'producto',
        component: ProductoComponent,
        canDeactivate: [ModalCloseGuard]
      },
      {
        path: 'sucursal',
        component: SucursalComponent,
        canDeactivate: [ModalCloseGuard]
      },
      {
        path: 'informacion',
        component: InformacionComponent,
        canDeactivate: [ModalCloseGuard]
      },
      {
        path: 'comparacionInventarios',
        component: ComparacionInventariosComponent,
        canDeactivate: [ModalCloseGuard]
      },

      //////////////SIN COMPONENTES DE REUTILIZACION/////////////////
    
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
