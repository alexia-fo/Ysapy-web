import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFuncionarioComponent } from './componentes/menu-funcionario/menu-funcionario.component';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { InfoComponent } from './paginas/info/info.component';
import { ModalConfirmarComponent } from './componentes/modal-confirmar/modal-confirmar.component';



@NgModule({
  declarations: [
    MenuFuncionarioComponent,
    InicioComponent,
    InfoComponent,
    ModalConfirmarComponent
  ],
  imports: [
    CommonModule,
    UtilidadesModule
  ],
  exports:[
    MenuFuncionarioComponent
  ]
})
export class CompartidosModule { }
