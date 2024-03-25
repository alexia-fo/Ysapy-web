import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { RegistrarPedidoService } from '../../../servicios/pedidos-funcionarios/registrar-pedido.service';
import { GuardarPedido, Marca, ProdPedido, Producto, RespuestaDatosPedido, RespuestaProductos, TurnoPedido } from '../../../modelos/pedido-funcionario';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { Validaciones } from 'src/app/validaciones/bd';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-registrar-pedidos',
  templateUrl: './registrar-pedidos.component.html',
  styleUrls: ['./registrar-pedidos.component.css']
})
export class RegistrarPedidosComponent {
  dtOptions = {
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


  //datos cabecera
  // invHabilitado:boolean=false;//estado de inventarios (se encuentra algun inventario disponible para agregarle salidas ?)
  // descripcion:string='';//detalle del estado de inventarios
  // fechaApertura:Date | undefined;
  // idCabeceraInv:number | undefined;

  idProductoSeleccionado!:number;//para evitar agregar en el array un idProducto modificado debido a que se obtiene mediante el formulario y el campo es editable

  productos:Producto[]=[]; //Productos disponibles para buscar y seleccionar en el modal

  productosPedidos:ProdPedido[]=[];//productos agregados a la tabla de pedidos
  
  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
    
  cargandoTablaPedido=false; //agregando-actualizando-quitando registros del datatable
  
  cargandoOperacion=false;//guardando el pedido
  
  cargandoProductos=false;//obteniendo los datos de los productos a buscar
  
  marcas:Marca[]=[]; //para el combo de tipo de marcas
  turnos:TurnoPedido[]=[]; //para el combo de tipo de marcas

  marcaSeleccionada:string='';// es de tipo string porque solo puedo asignar valores numericos, string como parametro de una peticio el la req.params de angular y al cargar la ventana no tendra ningun valor por lo que no puedo asignar null ni undefined
  turnoSeleccionado:string='';

   // Obtener la fecha de hoy en formato ISO
  fechaHoy = new Date().toISOString().substring(0, 16); //hasta 10 solo la fecha

  formCabecera=this.fb.group({
    observacion:['', ],
    marca:[null, [Validators.required]],
    // fechaEntrega: [this.fechaHoy, [Validators.required]],
    fechaEntrega: ["",
    {
      validators: [Validators.required],
      asyncValidators: [this.validacionPedido.bind(this)],
      // asyncValidators: [Validaciones.validacionPedido(this.servicioP, this.marcaSeleccionada)],
      // updateOn: "blur"
    }],
    turno:['', Validators.required]
  });

  formPedido:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
  });

  mensajeValidacionFecha:string='';
  fechaHabilitada:boolean=false;
  estableciendoMensaje=false;//todo>agregado ahora en tercer public


  unidadMedida:string="";


  constructor(
    private mensajeAlertify: AlertifyService, 
    private fb: FormBuilder, 
    private servicioP: RegistrarPedidoService,
  ){}


  ngOnInit(): void {

    //deshabilitar edicion de campos
    // this.formSalida.get('idProducto')?.disable();//solo mostramos
    this.formPedido.get('nombre')?.disable();//solo mostramos

    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatosPedido)=>{

        // this.invHabilitado=response.mostrar;
        // this.descripcion=response.descripcion;
        // this.fechaApertura=response.fechaApertura;
        // this.idCabeceraInv=response.idCabeceraInv;

        if(response.marca && response.turnos){
        // if(this.invHabilitado && response.marca && response.turnos){
          this.marcas=response.marca
          this.turnos=response.turnos;
        }

      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoProductos=false;
      }});



          //*actualizar las validaciones de fechaEntrega, una vez validado el campo fechaEntrega se puede volver a modificar la marca y el turno por lo que es necesario que se vuelva a validar cuando estos valores cambian
          // // Suscribirse a los cambios de valor de marca y turno
          // this.formCabecera.get('marca')?.valueChanges.subscribe((valor: null | Marca | string) => {
          //   this.marcaSeleccionada = valor?valor.CodMarca:'';
          //   this.formCabecera.get('fechaEntrega')?.updateValueAndValidity(); // Disparar la validación
          // });


          this.formCabecera.get('marca')?.valueChanges.subscribe((valor: null | Marca | string) => {
            if (typeof valor === 'string') {
              // Si el valor es un string, asigna el valor directamente a marcaSeleccionada
              this.marcaSeleccionada = valor;
            } else if (valor) {
              // Si el valor es un objeto Marca, accede a la propiedad CodMarca
              this.marcaSeleccionada = valor.codMarca.toString();
            } else {
              // Si el valor es null, asigna una cadena vacía a marcaSeleccionada
              this.marcaSeleccionada = '';
            }
          
            // Disparar la validación
            this.formCabecera.get('fechaEntrega')?.updateValueAndValidity();
          });
          

          this.formCabecera.get('turno')?.valueChanges.subscribe((valor:string | null) => {
            this.turnoSeleccionado = valor?valor:'';
            this.formCabecera.get('fechaEntrega')?.updateValueAndValidity(); // Disparar la validación
          });
  }

    // ------ MODAL DE FORMULARIO ------ //
    mostrarModal(id: string, mostrar:boolean) {
      if(mostrar){
        $(`#${id}`).modal('show');
      }else{
        $(`#${id}`).modal('hide');
      }
    }

    agregar(){

      //para validar campos dehabilitados pq no se incluyen en el formRecepcion.valid
      if(!(this.formPedido.get('idProducto')?.value || this.formPedido.get('nombre')?.value || this.idProductoSeleccionado)){
        this.mensajeAlertify.mensajeError('Seleccione el producto');
        return;
      }
  
      //para validar la cantidad del producto que es un campo habilitado o editable
      if(!this.formPedido.valid){
        this.formPedido.markAllAsTouched();
        return;
      }
  
      let { observacion  } = this.formCabecera.value;
      /*TODO: utilizamos el operador de coalescencia nula (??) para 
      asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante 
      en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas 
      de texto y evitas el error de asignación.*/
      
      observacion = observacion ?? '';
     
      let producto:ProdPedido = this.formPedido.value;
      //obtenemos los valores de los compos deshabilitados, se puede utilizar solo el metodo this.form.getRawValue()
      // producto.idProducto=this.formSalida.get('idProducto')?.value;
      producto.idProducto=this.idProductoSeleccionado;
      producto.nombre=this.formPedido.get('nombre')?.value;

      producto.unidad=this.unidadMedida;
  
      //let {cantidad}=this.formSalida.value
      let bandera=false;
      this.cargandoTablaPedido= true;
      if(this.accion=="Crear"){
  
        //this.productosRecibidos.push(producto);
        this.productosPedidos.forEach((p, i) => {
          if(p.idProducto==producto.idProducto){
            this.productosPedidos[i].cantidad=this.productosPedidos[i].cantidad+producto.cantidad;//ya esta validado con el formSalida.markAllAsTouched();
            bandera=true;
            //TODO:CORREGIR ERROR
            setTimeout(() => {
              this.cargandoTablaPedido = false;
            }, 0.1);
          }
        });
  
        if(!bandera){
          this.productosPedidos.push(producto);
          //TODO:CORREGIR ERROR
          
          setTimeout(() => {
            this.cargandoTablaPedido = false;
          }, 0.1);
        }
        
      }else if(this.accion=="Modificar"){
        this.cargandoTablaPedido=true;
  
        this.productosPedidos.forEach((p, i) => {
          if(p.idProducto==producto.idProducto){
            this.productosPedidos[i]=this.formPedido.value;
          }
        });
  
        //TODO:CORREGIR ERROR
        // this.cargandoTabRecepcion = false;
        setTimeout(() => {
          this.cargandoTablaPedido = false;
        }, 0.1);
  
      }
    
      // this.formSalida.reset();
      this.limpiarDetalle();
      
      this.accion='Crear'
      
      
      ///actualizamos los datos del localStorage


      if(this.productosPedidos.length>0){
        this.formCabecera.get('marca')?.disable();
      }
    }

    nuevo(){
      this.accion='Crear';
      this.limpiarDetalle();
    }

    limpiarDetalle(){
      this.formPedido.reset();

      this.unidadMedida=""
      //add
      // console.log("Agregar valor a formulario", new Date().toISOString().substring(0, 16))
    
      // this.formCabecera.get('fechaEntrega')?.setValue(new Date().toISOString().substring(0, 16));
      // console.log("Agregar valor a formulario fin ", this.formCabecera.get('fechaEntrega'))
    
    }

  confirmarEliminacion(producto:ProdPedido){
    this.idProductoSeleccionado=producto.idProducto;
    this.mostrarModal('modEliminarProducto', true);
    // this.mensajeAlertify.mensajeConfirmacion(
    //   `Desea quitar el producto ${producto.nombre} ?`,
    //   ()=>this.eliminar(producto.idProducto)
    // )
  }

    
  eliminar(id: number){
    this.accion='Eliminar';

    let { observacion  } = this.formCabecera.value;
    /*
    En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
    asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
    */
    observacion = observacion ?? '';

    this.cargandoTablaPedido=true;
    this.productosPedidos.forEach((p, i) => {
      if(p.idProducto==id){
        this.productosPedidos.splice(i, 1);
       // delete(this.productosRecibidos[i]);
      }
    }); 
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.dtTrigger.next(0);
    // })
    
    setTimeout(() => {
      this.cargandoTablaPedido = false;
    }, 0.1);

    this.accion='Crear'
    ///actualizamos los datos del localStorage
    // this.servicioP.saveItems(this.productosBaja, observacion);
  
    if(this.productosPedidos.length>0){
      this.formCabecera.get('marca')?.disable();
    }else{
      this.formCabecera.get('marca')?.enable();
    }
  }

  modificar(producto: ProdPedido) {
    console.log('modificar ', producto);
    this.accion = 'Modificar';
    // this.formPedido.setValue(producto);///para que la unidad no genere error
    this.formPedido.get('idProducto')?.setValue(producto.idProducto);
    this.formPedido.get('nombre')?.setValue(producto.nombre);
    this.formPedido.get('cantidad')?.setValue(producto.cantidad);
  
    this.idProductoSeleccionado = producto.idProducto;

    this.unidadMedida=producto.unidad;
  }

  buscar(){
    this.mostrarModal('smodal', true);
  }

  
  seleccionarProducto(i: Producto){
    //establecemos el valor del idProducto para luego guardar el mismo en el array y no el obtenido desde el formulario ya que se puede editar
    this.idProductoSeleccionado=i.idProducto;
    this.formPedido.get('idProducto')?.setValue(i.idProducto)
    this.formPedido.get('nombre')?.setValue(i.nombre)

    this.unidadMedida=i.Unidad.NombreUnidad;

    this.mostrarModal('smodal', false); 
  }


  //faltan mensajes
  mensaje(field:string){
    let mensaje="";

      //LOS CAMPOS DESHABILITADOS NO CONTIENEN ERRORES(validar con alertify)
      // if(field=="idProducto"){
      //   mensaje="El id es requerido..";
      // }

      // if(field=="nombre"){
      //   mensaje="El nombre es requerido..";
      // }

    if(this.formPedido.get(field)?.hasError('required')){
      if(field=="cantidad"){
        mensaje="La cantidad es requerida..";
      }

    }

    if(this.formPedido.get(field)?.hasError('min')){
      if(field == "cantidad"){
        mensaje="La cantidad mínima es 0";
      }
    }
    return mensaje;
  }

  //faltan mensajes
  mensajeCabecera(field:string){
    let mensaje="";

    if(this.formCabecera.get(field)?.hasError('required')){
      if(field=="marca"){
        mensaje="La marca es obligatoria..";
      }

      if(field=="fechaEntrega"){
        mensaje="La fecha es obligatoria..";
      }

      if(field=="turno"){
        mensaje="El turno es obligatorio..";
      }

    }

    if(this.formPedido.get(field)?.hasError('min')){
      if(field == "cantidad"){
        mensaje="La cantidad mínima es 0";
      }
    }
    return mensaje;
  }

  datoInvalido(campo:string){
    let valido=(this.formPedido.get(campo)?.touched || this.formPedido.get(campo)?.dirty) && this.formPedido.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if(valido){ //cuando ya hay interaccion del usuario y el campo es invalido
      input?.classList.add("is-invalid");
    }else if((this.formPedido.get(campo)?.touched || this.formPedido.get(campo)?.dirty) && this.formPedido.get(campo)?.valid){ //cuando ya hay interaccion del usuario y el campo es valido
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    }else{//se ejecuta cuando se carga la pagina por primera vez ya que aun no hay interacciones del usuario (los campos no tienen formato de validacion)
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }
     
    return valido;
  }

  datoInvalidoCabecera(campo:string){
    let valido=(this.formCabecera.get(campo)?.touched || this.formCabecera.get(campo)?.dirty) && this.formCabecera.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if(valido){ //cuando ya hay interaccion del usuario y el campo es invalido
      input?.classList.add("is-invalid");
    }else if((this.formCabecera.get(campo)?.touched || this.formCabecera.get(campo)?.dirty) && this.formCabecera.get(campo)?.valid){ //cuando ya hay interaccion del usuario y el campo es valido
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    }else{//se ejecuta cuando se carga la pagina por primera vez ya que aun no hay interacciones del usuario (los campos no tienen formato de validacion)
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }
     
    return valido;
  }

  guardar(){

    if(this.productosPedidos.length<1){
      this.mensajeAlertify.mensajeError(
        `Agregue al menos 1 producto !!`
      );
      return;
    }

    if(!this.formCabecera.valid){
      this.formCabecera.markAllAsTouched()
      return;
    }

    // this.mensajeAlertify.mensajeConfirmacion('Desea guardar el inventario',()=>{//todo:add

    let marcaValue: Marca | null | undefined = this.formCabecera.get('marca')?.value;

    let data:GuardarPedido={
      observacion:this.formCabecera.value.observacion || "", //para asegurar que siempre habra un valor con ||
      fechaEntrega:new Date(this.formCabecera.value.fechaEntrega!),
      marca: marcaValue!.codMarca,
      productos:this.productosPedidos,
      turno:parseInt(this.formCabecera.value.turno!),
    }

    console.log(this.formCabecera.value)
    console.log(this.formCabecera.get('marca')?.value)

    this.cargandoOperacion=true;
    this.servicioP.registrarPedidos(data).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        this.borrarDatos();
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        console.log(errores);
        this.cargandoOperacion = false;
      },
    });

  }

  //FIXME: se limpian todos los formularios y tabla para que la pagina se limpie sin recargar
  borrarDatos(){
    //add
    this.mensajeValidacionFecha="";

    // this.servicioP.removerItems();
    this.formCabecera.reset();
    this.formPedido.reset();

    //para evitar errores del datatable
    this.cargandoTablaPedido=true;
    this.productosPedidos=[];
    this.cargandoTablaPedido=false;

    this.formCabecera.get('marca')?.enable();
    this.productos=[];

    //todo: se tenia que poner la fecha de mañana por defecto pero esta generando innecesariamente el mensaje de error de la fecha
    //this.formCabecera.get('fechaEntrega')?.setValue(new Date().toISOString().substring(0, 16));
  
    }

  confirmarOperacionEnvio(){
    //prueba
    this.mostrarModal('modMensajeId',true)
  } 

  obtenerProductos2(e:any){

    console.log('this.formCabecera.value ', this.formCabecera.value)


    let marca: Marca | string = this.formCabecera.value.marca!;

    

    // this.servicioP.productosMarca(marcaSeleccionada)
    //   .subscribe({
    //     next:(response:RespuestaProductos)=>{
    //       this.productos=response.producto;
    //     },
    //     error:(errores)=>{
    //       errores.forEach((error: string) => {
    //         this.mensajeAlertify.mensajeError(error);
    //       });
    //       this.cargandoProductos=false;
    //     }});

  }

  obtenerProductos(e: any) {
    // console.log('this.formCabecera.value ', this.formCabecera.value);


    // if(!(this.productosPedidos.length > 0)){//ya no se usa

    this.cargandoProductos=true;
      
    let marca: Marca | string = this.formCabecera.value.marca!;

    if (typeof marca === 'object') {
      // Si `marca` es de tipo `Marca` (un objeto), puedes acceder a sus propiedades, como el id
      const marcaSeleccionada = marca as Marca;

      this.servicioP.productosMarca(marcaSeleccionada.codMarca)
          .subscribe({
              next: (response: RespuestaProductos) => {
                  this.productos = response.producto;
                  // console.log(response)
                  this.cargandoProductos=false;
              },
              error: (errores) => {
                  errores.forEach((error: string) => {
                      this.mensajeAlertify.mensajeError(error);
                  });
                  this.cargandoProductos = false;
              }
          });
    } 

  // }

  
  ///ya no se usa
  // let marcaValue: Marca | null | undefined = this.formCabecera.get('marca')?.value;


  // //para validacion asincrona de la fecha si se encuentra habilitada
  // this.marcaSeleccionada=(marcaValue!.codMarca).toString();
  // this.turnoSeleccionado=this.formCabecera.get('turno')?.value!;

}
  

validacionPedido(control: AbstractControl): Observable<ValidationErrors | null> {
  this.estableciendoMensaje=true;//todo:agregado en tercer public
  const fecha = control.value;
  return this.servicioP.pedidoHabilitado(fecha, this.marcaSeleccionada, this.turnoSeleccionado)
    .pipe(
      tap((valor:any)=>{
        if(valor.msg){
          // if(valor.isAvailable){
          //   this.mensajeAlertify.mensajeExito(valor.msg);
          // }else{
          //   this.mensajeAlertify.mensajeError(valor.msg);
          // }
          this.mensajeValidacionFecha=valor.msg;
          this.estableciendoMensaje=false;//todo:agregado en tercer public
        }else{
          this.mensajeValidacionFecha='';
          this.estableciendoMensaje=false;//todo:agregado en tercer public
        }
        this.fechaHabilitada=valor.isAvailable;
        console.log("valor isAvailable ", this.fechaHabilitada)
      }),
      map((response: any) => {
        return response.isAvailable ? null : { not_available: true };
      }),
      catchError(() => of({ not_available: true }))
    );
}

  
}
