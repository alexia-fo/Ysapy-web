import { Component } from '@angular/core';

//para modales de boostrap solo se importa en este punto
import * as bootstrap from "bootstrap";

//https://stackoverflow.com/questions/32050645/how-to-use-jquery-with-typescript
import * as $ from 'jquery';

//TODO:probando ocultar modal sin cerrar
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ysapy-web';
  //!probando ocultar modal sin cerrar
  // constructor(private router: Router) {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       // Cierra todos los modales abiertos utilizando jQuery
  //       $('#exampleModal').modal('hide');
  //     }
  //   });
  // }

  // constructor(private router: Router) {}
  // ngAfterViewInit() {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       // Verifica si existen elementos con la clase .modal en el DOM
  //       if ($('.modal').length > 0) {
  //         // Cierra todos los modales abiertos utilizando jQuery
  //         console.log("Existen modales abiertos")
  //         $('.modal').modal('hide');
  //       }else{
  //         console.log("No Existen modales abiertos")

  //       }
  //     }
  //   });
  // }
  


}
