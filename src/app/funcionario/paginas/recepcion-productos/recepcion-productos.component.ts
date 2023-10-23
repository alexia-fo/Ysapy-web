import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { GuardarRecepcion, ProdRecibido, RespuestaDatos } from '../../modelos/recepcion-productos.model';
import { RecepcionProductosService } from '../../servicios/recepcion-productos.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { Producto, RespuestaProducto, RespuestaSucursal } from '../../modelos/inv-rend.model';
import { InvRendService } from '../../servicios/inv-rend.service';

@Component({
  selector: 'app-recepcion-productos',
  templateUrl: './recepcion-productos.component.html',
  styleUrls: ['./recepcion-productos.component.css']
})

export class RecepcionProductosComponent {
  
  dtOptionsRecepcion = {
    paging:false,
    info: false,
    responsive:false,
    searching: false,
    language: {
      search: 'Buscar:',
      zeroRecords: 'No se encontraron resultados',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 a 0 de 0 registros',
      infoFiltered: '(filtrados de _MAX_ registros en total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      emptyTable: 'No se han agregado registros',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior',
      },
    },
  };

  /*FIXME:

    @ViewChild: Es un decorador Angular que se utiliza para acceder a elementos del DOM, componentes, directivas o instancias de componentes hijos dentro del componente actual.
    DataTableDirective: Esto es el primer argumento pasado al @ViewChild. Indica que estamos buscando una instancia de la directiva DataTableDirective.
    {static: false}: Es un objeto de configuración opcional que se puede proporcionar al decorador. En este caso, {static: false} significa que la referencia a la directiva se obtendrá de manera perezosa, es decir, después de que Angular haya inicializado las vistas y las directivas del componente.
    dtElement!: DataTableDirective;: Esto declara una propiedad llamada dtElement en el componente. Esta propiedad se inicializará con una referencia a la instancia de la directiva DataTableDirective.
    Entonces, ¿para qué sirve este código?

    El código @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective; se utiliza para obtener acceso a la instancia de la directiva DataTableDirective que está asociada a una tabla DataTable en el componente actual. Esto permite al componente interactuar con la tabla DataTable, realizar operaciones en ella (como destruirla) o configurar su comportamiento.

    En resumen, este código es esencial para tener control sobre la tabla DataTable y poder manipularla desde el componente de Angular en el que se encuentra. La propiedad dtElement contendrá la referencia a la directiva DataTableDirective, lo que facilita la interacción con la tabla dentro del componente.

  */
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  dtOptionsProductos = {
    paging:false,
    info:false,
    responsive:false,
    language: {
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

  //los formularios para cabecera y detalle son independientes
  formCabecera=this.fb.group({
    observacion:[''],
    nroComprobante:['', [Validators.required]],
  });

  formRecepcion:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
  });

  invHabilitado:boolean=false;//estado de inventarios (se encuentra algun inventario disponible para agregarle recepciones ?)
  descripcion:string='';//detalle del estado de inventarios
  fechaApertura!:Date;
  idCabeceraInv!:number;
  proximoNroComprobante!:number;

  
  productos:Producto[]=[];//Productos disponibles para buscar y seleccionar en el modal
  
  productosRecibidos:ProdRecibido[]=[];//productos agregados a la tabla de recepciones
  
  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
  
  cargandoTabRecepcion=false; //agregando-actualizando-quitando registros del datatable

  cargandoOperacion=false;//guardando la recepcion

  cargandoProductos=false; //obteniendo los datos de los productos a seleccionar

  constructor(
    private mensajeAlertify: AlertifyService,
    private fb: FormBuilder, 
    private servicioP: RecepcionProductosService,
    private detectorCambio: ChangeDetectorRef,
    private servicioC:InvRendService
  ){}

  ngOnInit(): void {

    //deshabilitar edicion de campos
    // this.formRecepcion.get('idProducto')?.disable();//solo mostramos
    this.formRecepcion.get('nombre')?.disable();//solo mostramos
    
    this.cargandoProductos=true;
    //para tabla de pantalla
    this.cargandoTabRecepcion=true;
    
    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatos)=>{
        
        this.cargandoProductos=false;
        
        this.invHabilitado=response.mostrar;
        this.descripcion=response.descripcion;
        
        if(this.invHabilitado){//si ya existe una apertura de inventario se puede registrar recepciones   
          this.productos=response.producto!;//se obtienen los productos si existe la apertura de inventario
          //si el inventario esta habilitado quiere decir que existe una cabecera por lo que si va a haber la fecha y el id
          this.fechaApertura=response.fechaApertura!;
          this.idCabeceraInv=response.idCabeceraInv!;
          this.proximoNroComprobante=response.proximoNroComprobante!;
          //!
          this.formCabecera.get('nroComprobante')?.setValue(this.proximoNroComprobante.toString());
                    
          //si ya se han agregado productos recepcionados y luego se ha recargado la pagina por alguna razon, se obtendrán nuevamente
            //esos productos ya que estan almacenados en el localStorage(que sean del usuario activo, y que sean de la fecha)
            let datosAlmacenados=this.servicioP.getItems();
            if(datosAlmacenados.items){
              this.productosRecibidos=datosAlmacenados.items;//se obtinen los productos ya agregados y no registrados del dia de hoy
              //!
              // this.formCabecera.get('observacion')?.setValue(datosAlmacenados.observacion);
              // this.formCabecera.get('nroComprobante')?.setValue(datosAlmacenados.nroComprobante);
            }
          }
          
          this.cargandoProductos=false;
          //una vez que se obtuvieron las recpciones del localStorage, si es que existen, se formatea el datatable
          //para evitar errores en la tabla al modificar el array al obtener los que fueron agregados previamente
          this.establecerDatos();
          this.cargandoTabRecepcion=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoProductos=false;
      }});
  }

  // ---------- DATATABLE ----------- //

  /*FIXME:

  TODO:this.detectorCambio.detectChanges();: Esta línea invoca el método detectChanges() del servicio ChangeDetectorRef
  Este método fuerza a Angular a verificar si ha habido cambios en el 
  componente y, si es necesario, realizar una actualización de la vista.

  this.dtTrigger.next(0);: EstA relacionado con el uso de Angular DataTable. this.dtTrigger es un objeto 
  Observable que se utiliza para notificar a la tabla de que debe actualizarse. Llamar al método next(0) notifica a la tabla que se deben cargar los datos.
  Es posible que esto sea necesario después de que los datos se hayan actualizado en el componente para asegurarse de que la tabla refleje esos cambios.
  */
  establecerDatos() {
    this.detectorCambio.detectChanges();
    this.dtTrigger.next(0);
  }

  /*FIXME:
  Esta función se utiliza para destruir y desmontar la instancia de la DataTable actual, lo que puede ser útil si necesitas reemplazar o reinicializar la tabla.
  this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => { dtInstancia.destroy(); });: En esta línea, this.dtElement es una referencia a un elemento 
  DataTable en el componente. Luego, se accede a la instancia de DataTable usando dtElement.dtInstance. Después, se llama al método destroy() de la instancia de DataTable 
  para destruir la tabla actual y liberar los recursos asociados.
  */
  renderizar() {
    this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
      dtInstancia.destroy();
    });
  }

  /*FIXME:
    Esta es una función del ciclo de vida de Angular que se llama cuando se destruye el componente. En este caso, se utiliza para realizar limpieza y desvincular el observador de 
    cambios en la tabla DataTable.
    this.dtTrigger.unsubscribe();: Aquí, se llama al método unsubscribe() en this.dtTrigger para desvincular el observador que podría estar escuchando cambios en la tabla DataTable. 
    Esto es importante para evitar posibles problemas de memoria o fugas de observables cuando el componente se destruye.
  */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // ------ MODAL DE FORMULARIO ------ //
  mostrarModal(id: string, mostrar:boolean) {
    if(mostrar){
      $(`#${id}`).modal('show');
    }else{
      $(`#${id}`).modal('hide');
    }
  }

  /*FIXME:
  Al agregar se verificará si se crea o modifica una recepcion, si se crea y se agrega el producto, en caso de que aun no exista se añade, si se vuelve a agregar un producto
  que ya se agrego previamente se suma la cantidad que se vuelve a agregar.
  En caso de que sea una modificacion se actualiza con la nueva cantidad
  */
  agregar(){

    //para validar campos dehabilitados pq no se incluyen en el formRecepcion.valid
    if(!(this.formRecepcion.get('idProducto')?.value || this.formRecepcion.get('nombre')?.value)){
      this.mensajeAlertify.mensajeError('Seleccione el producto');
      return;
    }

    //para validar la cantidad del producto que es campo habilitado o editable
    if(!this.formRecepcion.valid){
      this.formRecepcion.markAllAsTouched();
      return;
    }

    let { observacion , nroComprobante } = this.formCabecera.value;
    
    /*TODO: utilizamos el operador de coalescencia nula (??) para 
    asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante 
    en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas 
    de texto y evitas el error de asignación.*/
    
    observacion = observacion ?? '';
    nroComprobante = nroComprobante ?? '';
   
    let producto: ProdRecibido = this.formRecepcion.value;
    //obtenemos los valores de los compos deshabilitados, se puede utilizar solo el metodo this.form.getRawValue()
    producto.idProducto=this.formRecepcion.get('idProducto')?.value;
    producto.nombre=this.formRecepcion.get('nombre')?.value;

    //let {cantidad}=this.form.value
    let bandera=false;
    if(this.accion=="Crear"){
      this.cargandoTabRecepcion= true;

      //this.productosRecibidos.push(producto);
      this.productosRecibidos.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosRecibidos[i].cantidad=this.productosRecibidos[i].cantidad+producto.cantidad;//ya esta validado con el form.markAllAsTouched();
          bandera=true;
        }
      });

      if(!bandera){
        this.productosRecibidos.push(producto);
      }
      
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(0);
      });
      
      this.cargandoTabRecepcion = false;

    }else if(this.accion=="Modificar"){
      this.productosRecibidos.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosRecibidos[i]=this.formRecepcion.value;
        }
      });
    }
    this.limpiarDetalle();

    this.accion='Crear'
    ///actualizamos los datos del localStorage
    this.servicioP.saveItems(this.productosRecibidos, observacion, nroComprobante);
  }

  nuevo(){
    this.accion='Crear';
    this.limpiarDetalle();
  }

  /*FIXME:
    Muestra un mensaje para confirmar la eliminacion, en caso de que se presione aceptar se ejecuta la funcion de eliminar()
  */
  confirmarEliminacion(producto:ProdRecibido){
    this.mensajeAlertify.mensajeConfirmacion(
      `Desea quitar el producto ${producto.nombre} ?`,
      ()=>this.eliminar(producto.idProducto)
    )
  }

  eliminar(id: number){
    this.accion='Eliminar';

    let { observacion , nroComprobante } = this.formCabecera.value;
    /*
    En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
    asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
    */
    observacion = observacion ?? '';
    nroComprobante = nroComprobante ?? '';

    this.cargandoTabRecepcion=true;
    this.productosRecibidos.forEach((p, i) => {
      if(p.idProducto==id){
        this.productosRecibidos.splice(i, 1);
       // delete(this.productosRecibidos[i]);
      }
    }); 
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(0);
    })
    
    this.cargandoTabRecepcion = false;

    this.accion='Crear'
    ///actualizamos los datos del localStorage
    this.servicioP.saveItems(this.productosRecibidos, observacion, nroComprobante);
   }

  modificar(producto:ProdRecibido){
    this.accion='Modificar';
    this.formRecepcion.setValue(producto);
  }

  buscar(){
    this.mostrarModal('smodal', true);
  }

  seleccionarProducto(i: Producto){
    //settear los campos deshabilitados del formulario
    this.formRecepcion.get('idProducto')?.setValue(i.idProducto)
    this.formRecepcion.get('nombre')?.setValue(i.nombre)
    this.mostrarModal('smodal', false); 
  }

  mensaje(field:string){
    let mensaje="";
    if(this.formRecepcion.get(field)?.hasError('required')){
      //FIXME:LOS CAMPOS DESHABILITADOS NO CONTIENEN ERRORES(validar con alertify)
      // if(field=="idProducto"){
      //   mensaje="El id es requerido..";
      // }

      // if(field=="nombre"){
      //   mensaje="El nombre es requerido..";
      // }

      if(field=="cantidad"){
        mensaje="La cantidad es requerida..";
      }
    }

    if(this.formRecepcion.get(field)?.hasError('min')){
      if(field == "cantidad"){
        mensaje="La cantidad mínima es 0";
      }
    }
    return mensaje;
  }

    /*FIXME:

    datoInvalido(campo: string) {: Esta línea define la función datoInvalido que toma un parámetro llamado campo, 
    que es una cadena de texto que representa el nombre de un campo en un formulario Y ademas se utiliza el mismo para establecer el valor del id en los inputs, es decir,
    que el campo del this.form y el id del input en el html son el mismo.

    let valido = (this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.invalid;: 
    En esta línea, se evalúa si el campo es válido o no. Esto se hace verificando tres condiciones:

    this.form.get(campo)?.touched || this.form.get(campo)?.dirty: Se verifica si el campo ha sido tocado (interactuado por el usuario) o si ha sido modificado (dirty). Esto indica que el campo ha tenido alguna interacción.
    this.form.get(campo)?.invalid: Se verifica si el campo tiene un estado de "inválido" según las reglas de validación definidas para el formulario.
    let input = document.getElementById(campo);: Se obtiene una referencia al elemento del DOM (Documento de Objeto Modelo) correspondiente al campo del formulario utilizando el id proporcionado en el parámetro campo.

    if (valido) { ... }: Si la variable valido es true, significa que el campo es inválido según las condiciones establecidas. En este caso:

    Se agrega la clase "is-invalid" al elemento del DOM asociado al campo aplicar estilos visuales que indiquen que el campo es inválido.
    else if ((this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.valid) { ... }: Si el campo no es inválido, pero ha sido tocado o modificado por el usuario y es válido, se realiza lo siguiente:

    Se quita la clase "is-invalid" del elemento del DOM asociado al campo (si estaba presente).
    Se agrega la clase "is-valid" al elemento del DOM asociado al campo para aplicar estilos visuales que indiquen que el campo es válido.
    else { ... }: Si ninguna de las condiciones anteriores se cumple, se ejecuta este bloque:
    Se quita la clase "is-invalid" del elemento del DOM asociado al campo (si estaba presente).
    Se quita la clase "is-valid" del elemento del DOM asociado al campo (si estaba presente).
    return valido;: La función devuelve el valor de valido, que indica si el campo es inválido según las condiciones de validación definidas.

    En resumen, esta función datoInvalido se utiliza para gestionar la validación de un campo en un formulario HTML. Agrega o quita clases CSS ("is-invalid" y "is-valid") al elemento del DOM correspondiente al campo para reflejar su estado de validez. 
    Luego, devuelve un valor booleano que indica si el campo es inválido según las condiciones establecidas.
  */
  datoInvalido(campo:string){
    let valido=(this.formRecepcion.get(campo)?.touched || this.formRecepcion.get(campo)?.dirty) && this.formRecepcion.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if(valido){
      input?.classList.add("is-invalid");
    }else if((this.formRecepcion.get(campo)?.touched || this.formRecepcion.get(campo)?.dirty) && this.formRecepcion.get(campo)?.valid){
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    }else{
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }
     
    return valido;
  }

  guardar(){

    if(this.productosRecibidos.length<1){
      this.mensajeAlertify.mensajeError(
        `Agregue al menos 1 producto !!`
      );
      return;
    }

    if(!this.formCabecera.valid){
      this.mensajeAlertify.mensajeError(
        `Agregue el Número de comprobante !!`
      );
      return;
    }

    let data:GuardarRecepcion={
      nroComprobante: this.formCabecera.value.nroComprobante || "",
      observacion:this.formCabecera.value.observacion || "",
      productos:this.productosRecibidos,
    }

    this.cargandoOperacion = true;
    this.servicioP.registrarRecepcion(data).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        this.borrarDatos();

        //!
        this.formCabecera.get('nroComprobante')?.setValue((this.proximoNroComprobante+1).toString());
        // this.obtenerDatosRec()
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoOperacion = false;
      },
    });
  }

  //FIXME: se limpian todos los formularios y tabla para que la pagina se limpie sin recargar
  borrarDatos(){
    this.servicioP.removerItems();
    this.formCabecera.reset();
    this.formRecepcion.reset();

    //para evitar errores del datatable
    this.cargandoTabRecepcion=true;
    this.productosRecibidos=[];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      console.log('Destruyendo..');
      this.dtTrigger.next(0);
    })
    this.cargandoTabRecepcion=false;
  }

  limpiarDetalle(){
    this.formRecepcion.reset();
  }

  /*FIXME: para buscar producto mediante clicks en el campo id */
  onInputClick(event: KeyboardEvent) {
    /*if (event.key === 'F1') {
      // Muestra un mensaje cualquiera (puedes ajustar esto según tus necesidades)
      console.log('Se presionó F10');
      this.mostrarModal('smodal', true);
    }else*/ if(event.key==='Enter'){
        // Realiza la petición HTTP para obtener la información del producto
        
        console.log('Se presionó Enter');
        this.obtenerProducto();
    }

    // console.log('presionado')
    // const target = event.target as HTMLInputElement;
    // const inputValue = target.value;
    // if (inputValue === 'F1') {
    //   console.log('Se presionó F1');
    // } else if(inputValue==='Enter'){
    //   // Realiza la petición HTTP para obtener la información del producto
      
    //   console.log('Se presionó Enter');
    //   this.obtenerProducto();
    // }
  }

  obtenerProducto(){
    let idProducto = this.formRecepcion.get('idProducto')?.value;

    if(idProducto){
      this.servicioC.obtenerProductoPorId(idProducto).subscribe({
        next: (respuesta: RespuestaProducto) => {
          this.formRecepcion.get('nombre')?.setValue(respuesta.nombre);
          console.log(respuesta)
        },
        error: (errores: string[]) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          this.cargandoOperacion = false;
        },
      });
    }else{
      this.mensajeAlertify.mensajeError('Establezca el id de Producto - '+ idProducto);
    }
  }

  obtenerDatosRec(){
    this.cargandoProductos=true;
    //para tabla de pantalla
    this.cargandoTabRecepcion=true;
    
    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatos)=>{
        //console.log(response)
        
        this.cargandoProductos=false;
        this.invHabilitado=response.mostrar;
        this.descripcion=response.descripcion;
        
        if(this.invHabilitado){//si ya existe una apertura de inventario se puede registrar recepciones   
          this.productos=response.producto!;//se obtienen los productos si existe la apertura de inventario
          //si el inventario esta habilitado quiere decir que existe una cabecera por lo que si va a haber la fecha y el id
          this.fechaApertura=response.fechaApertura!;
          this.idCabeceraInv=response.idCabeceraInv!;

          //!
          this.formCabecera.get('nroComprobante')?.setValue(response.proximoNroComprobante!.toString());
                    
          //si ya se han agregado productos recepcionados y luego se ha recargado la pagina por alguna razon, se obtendrán nuevamente
            //esos productos ya que estan almacenados en el localStorage(que sean del usuario activo, y que sean de la fecha)
            let datosAlmacenados=this.servicioP.getItems();
            if(datosAlmacenados.items){
              this.productosRecibidos=datosAlmacenados.items;//se obtinen los productos ya agregados y no registrados del dia de hoy
              //!
              // this.formCabecera.get('observacion')?.setValue(datosAlmacenados.observacion);
              // this.formCabecera.get('nroComprobante')?.setValue(datosAlmacenados.nroComprobante);
            }
          }
          
          this.cargandoProductos=false;
          //una vez que se obtuvieron las recpciones del localStorage, si es que existen, se formatea el datatable
          //para evitar errores en la tabla al modificar el array al obtener los que fueron agregados previamente
          this.establecerDatos();
          this.cargandoTabRecepcion=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoProductos=false;
      }});

  }
}
