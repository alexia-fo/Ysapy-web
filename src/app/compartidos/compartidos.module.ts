import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFuncionarioComponent } from './componentes/menu-funcionario/menu-funcionario.component';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { InfoComponent } from './paginas/info/info.component';



@NgModule({
  declarations: [
    MenuFuncionarioComponent,
    InicioComponent,
    InfoComponent
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
