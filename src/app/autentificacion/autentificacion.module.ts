import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutentificacionRoutingModule } from './autentificacion-routing.module';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    LoginComponent,
    PerfilComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    AutentificacionRoutingModule,
    ReactiveFormsModule
  ]
})
export class AutentificacionModule { }
