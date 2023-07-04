import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    DataTablesModule
  ],
  exports:[
    UsuarioComponent
  ]
})
export class AdministracionModule { }
