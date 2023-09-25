import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaItem, TablaItemPipe, definicionColumnas } from '../../modelos/modal-buscar.model';
 
//!PRIMER: TABLA BASICA
//!SEGUNDO COMPONENTE TABLA PIPE
//! 3. TERCER COMPONENTE PARA REUTILIZAR: TABLA BOTON --> AGREGADOS: alineaciones y se puede habilitar la responsividad de datatable (se esta utilizando para abm de datos en modulo Administracion)
//TODO:POR AHORA EL EVENTO CLICK DE LOS BOTONES FUNCIONAN CORRECTAMENTE YA QUE EL COMPONENTE REUTILIZBLE SOLO SE USA UNA VEZ EN LAS PAGINAS
//TODO:PERO SI SE UTILIZA DOS VECES PUEDE QUE SE GENERE CONFLICTOS PORQUE LOS BOTONES DE CADA INSTANCIA DEL COMPONENTE REUTILIZABLE PUDEN REPETIRSE Y GENERAR CONFLICTO*/
@Component({
  selector: 'app-tabla-boton',
  templateUrl: './tabla-boton.component.html',
  styleUrls: ['./tabla-boton.component.css']
})
export class TablaBotonComponent<T> implements AfterViewInit{
  @Input() tabla!: TablaItemPipe<T>;//Datos necesarios para constuir a tabla: {array de objetos,array de objetos con propiedades a mostrar y su pipe si es necesario, array de cadenas para los encabezados de la tabla}
  @Output() itemSeleccionado: EventEmitter<T> = new EventEmitter<T>();
  @Input() cargandoTabla:boolean=true;//para no tratar de construir el template antes de obtener completamente los datos
  @Input() dtOpciones!: DataTables.Settings;//configuracion del datatable ( es posible agregar la propiedad responsive:true, ya que en el dtOption se configura el boton y su evento)
  @Input() alineaciones: ('left' | 'center' | 'right')[] = []; // alineaciones de los campos
  @Input() idNombre: string = 'id'; // nombre del campo que corresponde a una llave primaria para identificar el objeto seleccionado
  
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
  getValorConPipe(item: any, columna: definicionColumnas): any {
    const pipeInstance: any = columna.pipe; // Usar la instancia del pipe proporcionada
  
    const value = this.getPropiedadValor(item, columna.campo);
    return pipeInstance ? pipeInstance.transform(value) : value;
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
  getPropiedadValor(item: any, propiedad: string): any {
    const propiedades = propiedad.split('.'); // Dividir la propiedad en partes
  
    let valor = item;
    for (const prop of propiedades) {
      valor = valor[prop];
    }
  
    return valor;
  }

  /*FIXME:
    this.dtOpciones.initComplete se establece en una función que se ejecutará una vez que DataTables haya completado su inicialización. Esto se hace utilizando initComplete para asegurarse de que la tabla esté lista antes de agregar el evento de clic personalizado.

    Se utiliza $('table').on('click', '[id^="btnDetalle_"]', (event) => { ... }) para agregar un evento de clic a todos los elementos <table> en la página (lo que incluye la tabla generada por DataTables) que tengan un ID que comienza con "btnDetalle_", esto se aplica a los botones cuyos IDs comienzan con "btnDetalle_".

    Dentro del manejador de eventos de clic, se obtiene el itemId a partir del ID del botón al que se hizo clic. Esto se hace dividiendo el ID por el carácter "_", y luego se toma el segundo elemento del arreglo resultante. Esto debería ser un identificador único relacionado con el botón que se hizo clic.

    Se busca el objeto correspondiente dentro de this.tabla.datos que tenga una propiedad llamada this.idNombre(ejemplo:idProducto) que coincida con itemId. Esto se hace utilizando la función find, es decir, se busca un objeto dentro del arreglo this.tabla.datos cuya propiedad this.idNombre coincida con el itemId obtenido del ID del botón.

    Si se encuentra un objeto que coincida con el itemId, se llama a this.onItemButtonClicked(item) el cual emite el objeto(evento) al componente padre.
  */
  ngAfterViewInit(): void {
    this.dtOpciones.initComplete = () => {
      $('table').on('click', '[id^="btnDetalle_"]', (event) => {
        const itemId = event.target.id.split('_')[1]; // Obtiene el identificador único
        const item = this.tabla.datos.find(item => {
          return (item as any)[this.idNombre] === parseInt(itemId)
        });
        if (item !== undefined) {
          this.onItemButtonClicked(item);
        }
      });
    }
  }
  
  onItemButtonClicked(item: T): void {
    this.itemSeleccionado.emit(item);
  }
  
  /*FIXME:
    Esta función se utiliza en el código HTML para aplicar clases de alineación de texto dinámicas 
    a elementos <td> en una tabla. El uso de [ngClass] permite cambiar dinámicamente las clases de acuerdo con los valores de alineaciones[i], que es un arreglo de alineaciones que corresponden a las propiedades en tabla.propiedades.

    Por ejemplo, si alineaciones[i] es 'center', entonces [ngClass]="getAlineacionClase(alineaciones[i])" aplicará 
    la clase 'text-center' al elemento <td>, lo que afectará la alineación del texto dentro de ese elemento.

    DEBE TENER EL MISMO ORDEN QUE LOS CAMPOS DEL ENCABEZADO PORQUE SE ESTABLECE EN BASE A LAS POSICIONES DEL ARRAY
    */
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
