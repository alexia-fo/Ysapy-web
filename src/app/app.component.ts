import { Component } from '@angular/core';

//para modales de boostrap solo se importa en este punto
import * as bootstrap from "bootstrap";

//https://stackoverflow.com/questions/32050645/how-to-use-jquery-with-typescript
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ysapy-web';
}
