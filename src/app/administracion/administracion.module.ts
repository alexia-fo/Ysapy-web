import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './paginas/usuario/usuario.component';
import { ProductoComponent } from './paginas/producto/producto.component';
import { SucursalComponent } from './paginas/sucursal/sucursal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { DataTablesModule } from 'angular-datatables';
import { CompartidosModule } from '../compartidos/compartidos.module';
import { VerCalculosRendicionComponent } from './paginas/ver-calculos-rendicion/ver-calculos-rendicion.component';
import { VerDetalleRendicionComponent } from './paginas/ver-detalle-rendicion/ver-detalle-rendicion.component';
import { VerCabecerasInventarioComponent } from './paginas/ver-cabeceras-inventario/ver-cabeceras-inventario.component';
import { VerDetalleInventarioComponent } from './paginas/ver-detalle-inventario/ver-detalle-inventario.component';
import { VerDetalleSalidaComponent } from './paginas/ver-detalle-salida/ver-detalle-salida.component';
import { VerDetalleRecepcionComponent } from './paginas/ver-detalle-recepcion/ver-detalle-recepcion.component';
import { VerRendicionComponent } from './paginas/ver-rendicion/ver-rendicion.component';
import { InformacionComponent } from './paginas/informacion/informacion.component';
import { VerRecepcionesComponent } from './paginas/ver-recepciones/ver-recepciones.component';
import { VerSalidasComponent } from './paginas/ver-salidas/ver-salidas.component';
import { VerVentasComponent } from './paginas/ver-ventas/ver-ventas.component';
import { ComparacionInventariosComponent } from './paginas/comparacion-inventarios/comparacion-inventarios.component';
import { EditarInventariosComponent } from './paginas/editar-inventarios/editar-inventarios.component';
import { EditarRecepcionesComponent } from './paginas/editar-recepciones/editar-recepciones.component';
import { EditarSalidasComponent } from './paginas/editar-salidas/editar-salidas.component';
import { ComparacionRendicionesComponent } from './paginas/comparacion-rendiciones/comparacion-rendiciones.component';

@NgModule({
  declarations: [
    MainComponent,
    UsuarioComponent,
    ProductoComponent,
    SucursalComponent,
    VerCalculosRendicionComponent,
    VerDetalleRendicionComponent,
    VerCabecerasInventarioComponent,
    VerDetalleInventarioComponent,
    VerDetalleSalidaComponent,
    VerDetalleRecepcionComponent,
    VerRendicionComponent,
    InformacionComponent,
    VerRecepcionesComponent,
    VerSalidasComponent,
    VerVentasComponent,
    ComparacionInventariosComponent,
    EditarInventariosComponent,
    EditarRecepcionesComponent,
    EditarSalidasComponent,
    ComparacionRendicionesComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    UtilidadesModule,
    CompartidosModule,
    FormsModule,
  ]
})
export class AdministracionModule { }
