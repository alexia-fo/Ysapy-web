import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { GuardarRecepcion, ProdRecibido, RespuestaDatos } from '../../modelos/recepcion-productos.model';
import { RecepcionProductosService } from '../../servicios/recepcion-productos.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { Producto } from '../../modelos/inventario.model';

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

  formCabecera=this.fb.group({
    observacion:[''],
    nroComprobante:['', [Validators.required]],
  });

  formRecepcion:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
  });

  
  invHabilitado:boolean=false;
  descripcion:string='';
  
  productos:Producto[]=[];
  productosRecibidos:ProdRecibido[]=[];/*=[{idProducto:1, nombre:'prueba 1', cantidad:8}, {idProducto:2, nombre:'prueba 2', cantidad:8}, {idProducto:3, nombre:'prueba 3', cantidad:8}];*/
  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
  seleccionado!:Producto;
  cargandoTabRecepcion=false; 
  cargandoOperacion=false;
  cargandoProductos=false; //obteniendo los datos de los productos a buscar

  constructor(
    private mensajeAlertify: AlertifyService,
    private fb: FormBuilder, 
    private servicioP: RecepcionProductosService,
    private detectorCambio: ChangeDetectorRef,
  ){}

  ngOnInit(): void {

    this.formRecepcion.get('idProducto')?.disable();//solo mostramos
    this.formRecepcion.get('nombre')?.disable();//solo mostramos
    
    this.cargandoProductos=true;
    //para tabla de pantalla
    this.cargandoTabRecepcion=true;

    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatos)=>{
        // console.log("response, ", response)

        this.invHabilitado=response.mostrar;
        this.descripcion=response.descripcion;

        if(response.mostrar){//si ya existe una apertura de caja se puede registrar recepciones   
          this.productos=response.producto!;//se obtienen los productos si existe apertura
          //obtenemos datos del local storage
          if(this.servicioP.getItems().items){
            this.productosRecibidos=this.servicioP.getItems().items;//se obtinen los productos ya agregados y no registrados del dia de hoy
            this.formCabecera.get('observacion')?.setValue(this.servicioP.getItems().observacion);
            this.formCabecera.get('nroComprobante')?.setValue(this.servicioP.getItems().nroComprobante);
          }
        }
        this.cargandoTabRecepcion=false;

        this.establecerDatos();

        this.cargandoProductos=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoProductos=false;
      }});
  }

  // ---------- DATATABLE ----------- //

  establecerDatos() {
    this.detectorCambio.detectChanges();
    this.dtTrigger.next(0);
  }

  renderizar() {
    this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
      dtInstancia.destroy();
    });
  }

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

  //--------//
  agregar(){

    //para validar campos dehabilitados
    if(!(this.formRecepcion.get('idProducto')?.value || this.formRecepcion.get('nombre')?.value)){
      this.mensajeAlertify.mensajeError('Seleccione el producto');
      return;
    }

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
   
    let producto = this.formRecepcion.value;
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
      })
      
      this.cargandoTabRecepcion = false;
      
    }else if(this.accion=="Modificar"){
      this.productosRecibidos.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          // this.cargandoTabRecepcion= true;//add
          this.productosRecibidos[i]=this.formRecepcion.value;

          //add
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();
          //   this.dtTrigger.next(0);
          // })
          // this.cargandoTabRecepcion= false;
        }
      });
    }
    //this.renderizar();
    //this.establecerDatos();
    this.formRecepcion.reset();

    this.accion='Crear'
    ///actualizamos los datos del localStorage
    this.servicioP.saveItems(this.productosRecibidos, observacion, nroComprobante);
  }

  nuevo(){
    this.accion='Crear';
    this.limpiarDetalle();
  }

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
 
    ///
  }

  modificar(producto:ProdRecibido){
    this.accion='Modificar';
    this.formRecepcion.setValue(producto);
  }

  buscar(){
    this.mostrarModal('smodal', true);
  }

  seleccionarProducto(i: Producto){
    this.formRecepcion.get('idProducto')?.setValue(i.idProducto)
    this.formRecepcion.get('nombre')?.setValue(i.nombre)
    this.mostrarModal('smodal', false); 
  }

  //faltan mensajes
  mensaje(field:string){
    let mensaje="";
    if(this.formRecepcion.get(field)?.hasError('required')){
      //TODO:LOS CAMPOS DESHABILITADOS NO CONTIENEN ERRORES(validar con alertify)
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

    this.cargandoOperacion = false;
    this.servicioP.registrarRecepcion(data).subscribe({
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
        this.cargandoOperacion = false;
      },
    });
  }

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
}
