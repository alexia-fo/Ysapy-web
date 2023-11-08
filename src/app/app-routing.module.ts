import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarRolesGuard } from './guardianes/validar-roles.guard';
import { ValidarTokenGuard } from './guardianes/validar-token.guard';
import { InicioComponent } from './compartidos/paginas/inicio/inicio.component';
import { InfoComponent } from './compartidos/paginas/info/info.component';

const routes:Routes=[
  {
    path:'info',
    component:InfoComponent,
    canActivate: [ValidarTokenGuard, ValidarRolesGuard],
    data: {
      roles: ['ROOT', 'ADMINISTRADOR', 'FUNCIONARIO'] // Roles permitidos para acceder a la ruta
    }
  },
  {
    path:'inicio',
    component:InicioComponent,
    canActivate: [ValidarTokenGuard, ValidarRolesGuard],
    data: {
      roles: ['ROOT', 'ADMINISTRADOR', 'FUNCIONARIO'] // Roles permitidos para acceder a la ruta
    }
  },
  {
    path:'autentificacion',
    loadChildren:()=>import('./autentificacion/autentificacion.module').then(m=>m.AutentificacionModule)
  },
  {
    path:'administracion',
    loadChildren:()=>import('./administracion/administracion.module').then(m=>m.AdministracionModule),
    canActivate: [ValidarTokenGuard, ValidarRolesGuard],
    data: {
      roles: ['ROOT', 'ADMINISTRADOR'] // Roles permitidos para acceder a la ruta
    }
  },
  {
    path:'funcionario',
    loadChildren:()=>import('./funcionario/funcionario.module').then(m=>m.FuncionarioModule),
    
    canActivate: [ValidarTokenGuard, ValidarRolesGuard],
    data: {
      roles: ['FUNCIONARIO'] // Roles permitidos para acceder a la ruta
    }
    
  },
  {
    path:'**',
    redirectTo:'autentificacion'
  }  
]


@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash:true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
