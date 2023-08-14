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
import { VerCabecerasInventarioComponent } from './paginas/ver-cabeceras-inventario/ver-cabeceras-inventario.component';
import { VerDetalleInventarioComponent } from './paginas/ver-detalle-inventario/ver-detalle-inventario.component';
import { VerDetalleRendicionComponent } from './paginas/ver-detalle-rendicion/ver-detalle-rendicion.component';
import { AbmcUsuarioComponent } from './paginas/abmc-usuario/abmc-usuario.component';
import { AbmcProductoComponent } from './paginas/abmc-producto/abmc-producto.component';
import { AbmcSucursalComponent } from './paginas/abmc-sucursal/abmc-sucursal.component';
import { BooleanToStringPipe } from '../utilidades/pipes/boolean-to-string.pipe';

@NgModule({
  declarations: [
    MainComponent,
    UsuarioComponent,
    ProductoComponent,
    SucursalComponent,
    VerCalculosRendicionComponent,
    VerCabecerasInventarioComponent,
    VerDetalleInventarioComponent,
    VerDetalleRendicionComponent,
    AbmcUsuarioComponent,
    AbmcProductoComponent,
    AbmcSucursalComponent,
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
