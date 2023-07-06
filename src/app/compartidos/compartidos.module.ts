import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFuncionarioComponent } from './componentes/menu-funcionario/menu-funcionario.component';
import { UtilidadesModule } from '../utilidades/utilidades.module';



@NgModule({
  declarations: [
    MenuFuncionarioComponent
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
