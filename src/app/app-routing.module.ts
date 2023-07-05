import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes=[
  /*
  {
    path:'',
    component:InicioComponent
  },
  */
  {
    path:'autentificacion',
    loadChildren:()=>import('./autentificacion/autentificacion.module').then(m=>m.AutentificacionModule)
  },
  {
    path:'**',
    redirectTo:'autentificacion'
  }  
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
