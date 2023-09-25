import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem } from '../../modelos/modal-buscar.model';

//!Aun no fue implementado en ningun componente (podria utilizarse en recepciones y salidas de productos en modulo de Funcionario)
//TODO: No aplica pipes, tamaños de modal y la responsividad en dtOptions del datatable debe estar desactivado

@Component({
  selector: 'app-modal-buscar',
  templateUrl: './modal-buscar.component.html',
  styleUrls: ['./modal-buscar.component.css']
})
export class ModalBuscarComponent<T> {

  @Input() modalId: string='';//modalId: Esta propiedad de entrada permite especificar un identificador único para el modal. Puede utilizarse para abrir o manipular el modal mediante código.
  @Input() titulo: string='';// titulo: Esta propiedad de entrada permite establecer un título para el modal.
  @Input() tabla!: TablaItem<T>;//Datos necesarios para constuir a tabla: {array de objetos, propiedades a mostrar de los objetos, array de cadenas para los encabezados de la tabla}
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();

  //la configuracion del datatatable es la misma para todos las instancias de este componente
  dtOpciones: DataTables.Settings = {//configuracion del datatable
    paging: true,
    info: true,
    pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    /*
    lengthMenu: [5, 10, 15, 20],//habilita el selector de cantidad de registros con los siguiente numeros (lengthChange: false --> debe quitarse para que funcione)
    */
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 10, // establece la cantidad de registros por página en 10

    language: { //traducimos porque por defecto esta en ingles
      search: 'Buscar:',
      zeroRecords: 'No se encontraron resultados',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 a 0 de 0 registros',
      infoFiltered: '(filtrados de _MAX_ registros en total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      emptyTable: 'No hay datos disponibles en la tabla',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior',
      },
    },
  };

  //emitir el objeto seleccionado al componente padre
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
    const propiedades = propiedad.split('.'); 
  
    let valor = item;
    for (const prop of propiedades) {
      valor = valor[prop];
    }
  
    return valor;
  }
}
