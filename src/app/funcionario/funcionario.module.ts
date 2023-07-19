import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { MainComponent } from './main/main.component';
import { InvRendCabeceraComponent } from './paginas/inv-rend-cabecera/inv-rend-cabecera.component';
import { InventarioProductosComponent } from './paginas/inventario-productos/inventario-productos.component';
import { RendicionCajaComponent } from './paginas/rendicion-caja/rendicion-caja.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CompartidosModule } from '../compartidos/compartidos.module';
import { RecepcionProductosComponent } from './paginas/recepcion-productos/recepcion-productos.component';
import { SalidaProductosComponent } from './paginas/salida-productos/salida-productos.component';


@NgModule({
  declarations: [
    MainComponent,
    InvRendCabeceraComponent,
    InventarioProductosComponent,
    RendicionCajaComponent,
    RecepcionProductosComponent,
    SalidaProductosComponent
  ],
  imports: [
    CommonModule,
    FuncionarioRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    CompartidosModule
  ]
})
export class FuncionarioModule { }