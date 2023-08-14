import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { GuardarSalida, ProdEnBaja, RespuestaDatos, Salida } from '../../modelos/salida-productos.model';
import { SalidaProductosService } from '../../servicios/salida-productos.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { Producto } from '../../modelos/inventario.model';

@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css']
})
export class SalidaProductosComponent {

  //dtOptions: DataTables.Settings = {};
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
    observacion:['', [Validators.required]],
    //nroComprobante:['', [Validators.required]],
  });

  formSalida:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
    salida:['', [Validators.required]],
  });

  invHabilitado:boolean=false;
  descripcion:string='';

  productos:Producto[]=[]; //para la tabla del buscador
  //para tabla de productos añadidos
  productosBaja:ProdEnBaja[]=[];/*=[{idProducto:1, nombre:'prueba 1', cantidad:8}, {idProducto:2, nombre:'prueba 2', cantidad:8}, {idProducto:3, nombre:'prueba 3', cantidad:8}];*/
  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
  seleccionado!:Producto;
  cargandoTablaSalida=false; //obteniendo los datos de los productos a buscar
  cargandoOperacion=false;
  cargandoProductos=false; 
  
  salidas:Salida[]=[]; //para el combo de tipo de salidas

  constructor(
    private mensajeAlertify: AlertifyService,
    private fb: FormBuilder, 
    private servicioP: SalidaProductosService,
    private detectorCambio: ChangeDetectorRef,
    ){}


  ngOnInit(): void {
    this.formSalida.get('idProducto')?.disable();//solo mostramos
    this.formSalida.get('nombre')?.disable();//solo mostramos
    
    this.cargandoProductos=true;
    
    this.cargandoTablaSalida=true;


    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatos)=>{

        this.invHabilitado=response.mostrar;
        this.descripcion=response.descripcion;

        if(response.mostrar){//si ya existe una apertura de caja se puede registrar recepciones
          this.productos=response.producto!;//se obtienen los productos si existe apertura
          this.salidas=response.salida!;
          //obtenemos datos del local storage
          if(this.servicioP.getItems().items){
            this.productosBaja=this.servicioP.getItems().items;//se obtinen los productos ya agregados y no registrados del dia de hoy
            this.formCabecera.get('observacion')?.setValue(this.servicioP.getItems().observacion);
          }
        }
        this.cargandoProductos=false;

        this.establecerDatos();

        this.cargandoTablaSalida=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoTablaSalida=false;
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

    //validar campos dehabilitados
    if(!(this.formSalida.get('idProducto')?.value || this.formSalida.get('nombre')?.value)){
      this.mensajeAlertify.mensajeError('Seleccione el producto');
      return;
    }
    
    if(!this.formSalida.valid){
      this.formSalida.markAllAsTouched();
      return;
    }

    let { observacion  } = this.formCabecera.value;
      /*TODO: utilizamos el operador de coalescencia nula (??) para 
      asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.*/
    
    observacion = observacion ?? '';
   
    let producto:ProdEnBaja = this.formSalida.value;
    //obtenemos los valores de los compos deshabilitados
    producto.idProducto=this.formSalida.get('idProducto')?.value;
    producto.nombre=this.formSalida.get('nombre')?.value;

    //let {cantidad}=this.formSalida.value
    let bandera=false;
    if(this.accion=="Crear"){
      this.cargandoTablaSalida= true;

      //this.productosRecibidos.push(producto);
      this.productosBaja.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosBaja[i].cantidad=this.productosBaja[i].cantidad+producto.cantidad;//ya esta validado con el formSalida.markAllAsTouched();
          bandera=true;
        }
      });

      if(!bandera){
        this.productosBaja.push(producto);
      }
      
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(0);
      })
      
      this.cargandoTablaSalida = false;
      
    }else if(this.accion=="Modificar"){
      this.productosBaja.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosBaja[i]=this.formSalida.value;
        }
      });
    }
    //this.renderizar();
    //this.establecerDatos();
    this.formSalida.reset();

    this.accion='Crear'
    ///actualizamos los datos del localStorage
    this.servicioP.saveItems(this.productosBaja, observacion);
  }

  nuevo(){
    this.accion='Crear';
    this.limpiarDetalle();
  }

  confirmarEliminacion(producto:ProdEnBaja){
    this.mensajeAlertify.mensajeConfirmacion(
      `Desea quitar el producto ${producto.nombre} ?`,
      ()=>this.eliminar(producto.idProducto)
    )
  }

  eliminar(id: number){
    let { observacion  } = this.formCabecera.value;
    /*
    En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
    asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
    */
    observacion = observacion ?? '';

    this.cargandoTablaSalida=true;
    this.productosBaja.forEach((p, i) => {
      if(p.idProducto==id){
        this.productosBaja.splice(i, 1);
       // delete(this.productosRecibidos[i]);
      }
    }); 
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(0);
    })
    
    this.cargandoTablaSalida = false;


    this.accion='Crear'
    ///actualizamos los datos del localStorage
    this.servicioP.saveItems(this.productosBaja, observacion);
  
    ///
  }

  modificar(producto:ProdEnBaja){
    this.accion='Modificar';
    this.formSalida.setValue(producto);
  }

  buscar(){
    this.mostrarModal('smodal', true);
  }

  seleccionarProducto(i: Producto){
    this.formSalida.get('idProducto')?.setValue(i.idProducto)
    this.formSalida.get('nombre')?.setValue(i.nombre)
    this.mostrarModal('smodal', false); 
  }


  //faltan mensajes
  mensaje(field:string){
    let mensaje="";
    if(this.formSalida.get(field)?.hasError('required')){
      //TODO:LOS CAMPOS DESHABILITADOS NO CONTIENEN ERRORES(validar con alertify)
      //LOS CAMPOS DESHABILITADOS NO TIENEN ERRORES
      // if(field=="idProducto"){
      //   mensaje="El id es requerido..";
      // }

      // if(field=="nombre"){
      //   mensaje="El nombre es requerido..";
      // }

      if(field=="cantidad"){
        mensaje="La cantidad es requerida..";
      }

      if(field=="salida"){
        mensaje="El tipo es requerido..";
      }
    }

    if(this.formSalida.get(field)?.hasError('min')){
      if(field == "cantidad"){
        mensaje="La cantidad mínima es 0";
      }
    }
    return mensaje;
  }

  datoInvalido(campo:string){
    let valido=(this.formSalida.get(campo)?.touched || this.formSalida.get(campo)?.dirty) && this.formSalida.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if(valido){
      input?.classList.add("is-invalid");
    }else if((this.formSalida.get(campo)?.touched || this.formSalida.get(campo)?.dirty) && this.formSalida.get(campo)?.valid){
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    }else{
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }
     
    return valido;
  }

  guardar(){

    if(this.productosBaja.length<1){
      this.mensajeAlertify.mensajeError(
        `Agregue al menos 1 producto !!`
      );
      return;
    }

    let data:GuardarSalida={
      observacion:this.formCabecera.value.observacion || "",
      productos:this.productosBaja,
    }

    this.cargandoOperacion=true;
    this.servicioP.registrarSalida(data).subscribe({
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

  borrarDatos(){
    this.servicioP.removerItems();
    this.formCabecera.reset();
    this.formSalida.reset();

    //para evitar errores del datatable
    this.cargandoTablaSalida=true;
    this.productosBaja=[];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(0);
    })
    this.cargandoTablaSalida=false;
  
  }

  
  limpiarDetalle(){
    this.formSalida.reset();
  }

}
