import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem } from '../../modelos/modal-buscar.model';
//! 1. PRIMER COMPONENTE GENERADO PARA TABLAS REUTILIZABLES:tabla-basica (no se esta utilizando)
//!SEGUNDO COMPONENTE:TABLA PIPE
//!TERCER COMPONENTE:TABLA BOTON
@Component({
  selector: 'app-tabla-basica',
  templateUrl: './tabla-basica.component.html',
  styleUrls: ['./tabla-basica.component.css']
})
export class TablaBasicaComponent<T> {
  
  @Input() tabla!: TablaItem<T>;//Datos necesarios para constuir a tabla: {array de objetos, propiedades a mostrar de los objetos, array de cadenas para los encabezados de la tabla}
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla:boolean=true;//para no tratar de construir el template antes de obtener completamente los datos
  @Input() dtOpciones!: DataTables.Settings; //configuracion del datatable (desactivar la opcion de responsividad para evitar errores --> responsive:false-- si esta en true evento click en boton no funciona, doble click en la fila sí)

  seleccionarItem(item: T) {
    this.itemSeleccionado.emit(item);
  }

/*FIXME:
se utiliza para acceder a las propiedades de objetos almacenados en un array, objeto 
que contiene propiedades anidadas y deseas obtener el valor de una propiedad específica mediante un camino o ruta de propiedades.

item: el objeto del cual se obtiene el valor de una propiedad. 

propiedad: representa la propiedad se desesa obtener del objeto item. La propiedad puede estar anidada en objetos internos, por lo que se puede especificar una ruta de propiedades utilizando notación de punto. 
Por ejemplo, si hay un objeto con una propiedad 'producto' y dentro de ese objeto se desea obtener la propiedad 'precio', se puede especificar 'producto.precio' como propiedad.

La función comienza dividiendo la propiedad en partes utilizando propiedad.split('.'). Esto convierte la cadena de propiedades en un arreglo de cadenas, donde cada elemento del arreglo representa una parte de 
la ruta de propiedades. Por ejemplo, 'producto.precio' se convertiría en ['producto', 'precio'].

La función entra en un bucle for...of que itera a través de las partes de la propiedad. Para cada parte, se accede a la propiedad correspondiente en el objeto valor. Esto se hace utilizando la notación de corchetes, 
por ejemplo, valor[prop], donde prop es la parte de la propiedad actual en el bucle.

El bucle continúa iterando a través de las partes de la propiedad, accediendo a las propiedades anidadas hasta llegar a la última propiedad especificada.

Finalmente, se devuelve el valor obtenido después de navegar a través de las propiedades anidadas. Esto será el valor de la propiedad final especificada en propiedad.

*/
getPropiedadValor(item: any, propiedad: string): any {
  const propiedades = propiedad.split('.'); // Dividir la propiedad en partes

  let valor = item;
  for (const prop of propiedades) {
    valor = valor[prop];
  }

  return valor;
}

}
