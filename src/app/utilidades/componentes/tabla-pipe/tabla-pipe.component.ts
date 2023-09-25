import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem, TablaItemPipe, definicionColumnas } from '../../modelos/modal-buscar.model';
//!PRIMER: TABLA BASICA
//! 2. SEGUNDO COMPONENTE GENERADO PARA TABLAS REUTILIZABLES:tabla-pipe -->AGREGADOS: pipes (no se esta utilizando)
//!TERCER COMPONENTE:TABLA BOTON
@Component({
  selector: 'app-tabla-pipe',
  templateUrl: './tabla-pipe.component.html',
  styleUrls: ['./tabla-pipe.component.css']
})
export class TablaPipeComponent<T>  {
  
  @Input() tabla!: TablaItemPipe<T>;//Datos necesarios para constuir a tabla: {array de objetos,array de objetos con propiedades a mostrar y su pipe si es necesario, array de cadenas para los encabezados de la tabla}
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla:boolean=true;//para no tratar de construir el template antes de obtener completamente los datos
  @Input() dtOpciones!: DataTables.Settings;//configuracion del datatable (desactivar la opcion de responsividad para evitar errores --> responsive:false-- si esta en true evento click de angular en el boton no funciona, doble click en la fila sí pero en este caso no se utiliza)
  
  seleccionarItem(item: T) {
    this.itemSeleccionado.emit(item);
  }

  /*FIXME:
  item: Este es el objeto del que deseas obtener el valor de una propiedad.

  columna: Este es un objeto que representa una columna de una tabla. De la columna, se extraen dos propiedades:

  columna.campo: Esto es una cadena que representa la propiedad que deseas obtener del objeto item. La propiedad puede estar anidada en objetos internos, y la función getPropiedadValor se utiliza para acceder a ella.
  columna.pipe: Esto es una instancia de un filtro (pipe) que deseas aplicar al valor de la propiedad antes de devolverlo. Si columna.pipe es null o undefined, significa que no se debe aplicar ningún filtro.

  Se obtiene la instancia del filtro almacenada en columna.pipe y se almacena en la variable pipeInstance.

  A continuación, se aplica el filtro al valor obtenido utilizando pipeInstance.transform(value). Esto llama al método transform del filtro con el valor como argumento y devuelve el resultado transformado. 
  Si columna.pipe es null o undefined, simplemente se devuelve el valor sin aplicar ningún filtro.

  */
  getValorConPipe(item: any, columna: definicionColumnas): any {
    const pipeInstance: any = columna.pipe; // Usar la instancia del pipe proporcionada

    const value = this.getPropiedadValor(item, columna.campo);
    return pipeInstance ? pipeInstance.transform(value) : value;
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
