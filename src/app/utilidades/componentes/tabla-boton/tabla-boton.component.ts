import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem, TablaItemPipe, definicionColumnas } from '../../modelos/modal-buscar.model';

//!SE REALIZO EN BASE A TABLA PIPE

@Component({
  selector: 'app-tabla-boton',
  templateUrl: './tabla-boton.component.html',
  styleUrls: ['./tabla-boton.component.css']
})
export class TablaBotonComponent<T> implements AfterViewInit{

  ngAfterViewInit(): void {

    this.dtOpciones.initComplete=()=>{

      $('table').on('click', '[id^="btnDetalle_"]', (event) => {
        console.log("Ejecutando el jquery")
        const rowIndex = $(event.target).closest('tr').index();
        const item = this.tabla.datos[rowIndex];
        this.onItemButtonClicked(item);
      }); 
       
    }

  }

  // ngAfterViewInit(): void {
  //   console.log("Ejecutando el ngAfterView")
  //   $('table').on('click', '[id^="btnDetalle_"]', (event) => {
  //     console.log("Ejecutando el jquery")
  //     const rowIndex = $(event.target).closest('tr').index();
  //     const item = this.tabla.datos[rowIndex];
  //     this.onItemButtonClicked(item);
  //   });
  // }

  // constructor(){

  // }
  
  onItemButtonClicked(item: T): void {
    this.itemSeleccionado.emit(item);
  }

  @Input() tabla!: TablaItemPipe<T>;
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla:boolean=true;
  @Input() dtOpciones!: DataTables.Settings;

  //prueba alineaiciones
  @Input() alineaciones: ('left' | 'center' | 'right')[] = []; // Agrega esta línea


  // @Input() pipes: { [key: string]: any } = {}; // Pipes proporcionados por el componente padre
  
  seleccionarItem(item: T) {
    this.itemSeleccionado.emit(item);
  }

/*
 tabla.propiedades es un array que contiene las propiedades que deseas mostrar en tu tabla. Por ejemplo,
 si tienes objetos con una propiedad 'producto' y dentro de ese objeto deseas obtener la propiedad 'precio',
 puedes hacerlo de esta manera
*/
getValorConPipe(item: any, columna: definicionColumnas): any {
  const pipeInstance: any = columna.pipe; // Usar la instancia del pipe proporcionada

  const value = this.getPropiedadValor(item, columna.campo);
  return pipeInstance ? pipeInstance.transform(value) : value;
}


getPropiedadValor(item: any, propiedad: string): any {
  const propiedades = propiedad.split('.'); // Dividir la propiedad en partes

  let valor = item;
  for (const prop of propiedades) {
    valor = valor[prop];
  }

  return valor;
}

///para establecer las alineaciones de los campos 

getAlineacionClase(alineacion: 'left' | 'center' | 'right' | undefined): string {
  switch (alineacion) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-end';
    case 'left':
    default:
      return 'text-start';
    }
}

}
