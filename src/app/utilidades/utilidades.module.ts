import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuNavegacionComponent } from './componentes/menu-navegacion/menu-navegacion.component';
import { ModalComponent } from './componentes/modal/modal.component';
import { ModalBuscarComponent } from './componentes/modal-buscar/modal-buscar.component';
import { ModalFormularioComponent } from './componentes/modal-formulario/modal-formulario.component';
import { TablaServersideComponent } from './componentes/tabla-serverside/tabla-serverside.component';
import { TablaBasicaComponent } from './componentes/tabla-basica/tabla-basica.component';
import { TablaEventoComponent } from './componentes/tabla-evento/tabla-evento.component';
import { MenuRafComponent } from './paginas/menu-raf/menu-raf.component';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { TablaPipeComponent } from './componentes/tabla-pipe/tabla-pipe.component';



@NgModule({
  declarations: [
    MenuNavegacionComponent,
    ModalComponent,
    ModalBuscarComponent,
    ModalFormularioComponent,
    TablaServersideComponent,
    TablaBasicaComponent,
    TablaEventoComponent,
    MenuRafComponent,
    TablaPipeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule
  ],
  exports: [
    MenuNavegacionComponent,
    ModalComponent,
    ModalBuscarComponent,
    ModalFormularioComponent,
    TablaServersideComponent,
    TablaBasicaComponent,
    TablaEventoComponent,
    MenuRafComponent
  ],
})
export class UtilidadesModule { }
