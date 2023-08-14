import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem, TablaItemPipe, definicionColumnas } from '../../modelos/modal-buscar.model';

@Component({
  selector: 'app-tabla-pipe',
  templateUrl: './tabla-pipe.component.html',
  styleUrls: ['./tabla-pipe.component.css']
})
export class TablaPipeComponent<T>  {
  
  @Input() tabla!: TablaItemPipe<T>;
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla:boolean=true;
  @Input() dtOpciones!: DataTables.Settings;

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

}
