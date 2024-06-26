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
import { VisualizarInventariosComponent } from './paginas/visualizar-inventarios/visualizar-inventarios.component';
import { VisualizarRecepcionesComponent } from './paginas/visualizar-recepciones/visualizar-recepciones.component';
import { VisualizarSalidasComponent } from './paginas/visualizar-salidas/visualizar-salidas.component';
import { VerProductosComponent } from './paginas/ver-productos/ver-productos.component';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { RegistroMegasComponent } from './paginas/registro-megas/registro-megas.component';
import { RegistrarPedidosComponent } from './paginas/pedidos-funcionarios/registrar-pedidos/registrar-pedidos.component';
import { VerPedidosEnviadosComponent } from './paginas/pedidos-funcionarios/ver-pedidos-enviados/ver-pedidos-enviados.component';
import { VerPedidosRecibidosComponent } from './paginas/pedidos-funcionarios/ver-pedidos-recibidos/ver-pedidos-recibidos.component';
import { EditarPedidosComponent } from './paginas/pedidos-funcionarios/editar-pedidos/editar-pedidos.component';



@NgModule({
  declarations: [
    MainComponent,
    InvRendCabeceraComponent,
    InventarioProductosComponent,
    RendicionCajaComponent,
    RecepcionProductosComponent,
    SalidaProductosComponent,
    VisualizarInventariosComponent,
    VisualizarRecepcionesComponent,
    VisualizarSalidasComponent,
    VerProductosComponent,
    RegistroMegasComponent,
    RegistrarPedidosComponent,
    VerPedidosEnviadosComponent,
    VerPedidosRecibidosComponent,
    EditarPedidosComponent,
    
    

  ],
  imports: [
    CommonModule,
    FuncionarioRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    CompartidosModule,
    /////////prueba 16-11
    UtilidadesModule
  ]
})
export class FuncionarioModule { }
