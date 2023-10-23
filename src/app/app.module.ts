import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//para todos los servicios
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SwiperModule } from 'swiper/angular';
import { TokenInterceptor } from './interceptores/token';

//para configuracion global de los pipes, es decir, que en todos los modulos de los componentes este en formato español 
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SwiperModule,

  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
  //para configuracion global de los pipes, es decir, que en todos los modulos de los componentes este en formato español 
  {
      provide: LOCALE_ID,
      useValue: 'es' // Configura el idioma español
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  //para configuracion global de los pipes, es decir, que en todos los modulos de los componentes este en formato español 
  constructor() {
    registerLocaleData(localeEs); // Registra el idioma español
  }
}
