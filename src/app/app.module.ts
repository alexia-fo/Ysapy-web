import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//para todos los servicios
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SwiperModule } from 'swiper/angular';
import { TokenInterceptor } from './interceptores/token';

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
