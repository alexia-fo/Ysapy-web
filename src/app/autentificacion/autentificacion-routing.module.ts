import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { MainComponent } from './main/main.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';

const routes: Routes = [
  {
    path:"",
    component:MainComponent,
    children:[
      {
        path:'login',
        component:LoginComponent
      },
      {
        path:'perfil',
        component:PerfilComponent
      },
      {
        path:'**',
        redirectTo:'login'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutentificacionRoutingModule { }
