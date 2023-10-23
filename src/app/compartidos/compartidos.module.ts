import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFuncionarioComponent } from './componentes/menu-funcionario/menu-funcionario.component';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { InicioComponent } from './paginas/inicio/inicio.component';



@NgModule({
  declarations: [
    MenuFuncionarioComponent,
    InicioComponent
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
