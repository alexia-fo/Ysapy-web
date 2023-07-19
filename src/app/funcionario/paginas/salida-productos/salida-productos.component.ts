import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProdEnBaja, Producto, RespuestaDatos, Salida } from '../../modelos/salida-productos.model';
import { SalidaProductosService } from '../../servicios/salida-productos.service';

@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css']
})
export class SalidaProductosComponent {
  
  //para tabla de productos añadidos
  cargandoT=false; 

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

  form:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
    salida:['', [Validators.required]],
  });

  invHabilitado:boolean=false;
  descripcion:string='';
  productos:Producto[]=[]; //para la tabla del buscador
  salidas:Salida[]=[]; //para el combo de tipo de salidas


  productosBaja:ProdEnBaja[]=[];/*=[{idProducto:1, nombre:'prueba 1', cantidad:8}, {idProducto:2, nombre:'prueba 2', cantidad:8}, {idProducto:3, nombre:'prueba 3', cantidad:8}];*/
  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
  seleccionado!:Producto;
  cargando=false;
  
  cargandoTabla=false; //obteniendo los datos de los productos a buscar

  constructor(
    private mensajeAlertify: AlertifyService,
    private fb: FormBuilder, 
    private servicioP: SalidaProductosService,
    private detectorCambio: ChangeDetectorRef,
    ){}


  ngOnInit(): void {
    console.log('longitud ', this.productosBaja.length)
    this.form.get('idProducto')?.disable();//solo mostramos
    this.form.get('nombre')?.disable();//solo mostramos

    
    this.cargandoTabla=true;

    //para tabla de pantalla
    this.cargandoT=true;

    this.servicioP.obtenerDatos()
    .subscribe({
      next:(response:RespuestaDatos)=>{
        this.invHabilitado=response.mostrar;
        this.descripcion=response.descripcion;
        if(response.mostrar){//si ya existe una apertura de caja se puede registrar recepciones
          this.productos=response.producto!;//se obtienen los productos si existe apertura
          this.salidas=response.salida!;
          console.log('response.producto',response.producto)
          //obtenemos datos del local storage
          const {items, observacion} =this.servicioP.getItems();
          console.log('items ', items)
          if(items){
            this.productosBaja=items;//se obtinen los productos ya agregados y no registrados del dia de hoy
            console.log('this.productosBaja',this.productosBaja)
            this.formCabecera.get('observacion')?.setValue(observacion);
          }
        }
        this.cargandoT=false;

        this.establecerDatos();

        this.cargandoTabla=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        console.log(errores);
        this.cargandoTabla=false;
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

    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    ////datos de la cabecera
    let { observacion  } = this.formCabecera.value;
    /*
  En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
  asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
    */
    observacion = observacion ?? '';

    //fin datos de la cabecera
   
    let producto:ProdEnBaja = this.form.value;
    //obtenemos los valores de los compos deshabilitados
    producto.idProducto=this.form.get('idProducto')?.value;
    producto.nombre=this.form.get('nombre')?.value;

    //let {cantidad}=this.form.value
    let bandera=false;
    if(this.accion=="Crear"){
      this.cargandoT= true;////


      //this.productosRecibidos.push(producto);
      this.productosBaja.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosBaja[i].cantidad=this.productosBaja[i].cantidad+producto.cantidad;//ya esta validado con el form.markAllAsTouched();
          bandera=true;
        }
      });

      if(!bandera){
        this.productosBaja.push(producto);
      }
      
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        console.log('Destruyendo..');
        this.dtTrigger.next(0);
      })
      
      this.cargandoT = false;/////
      
    }else if(this.accion=="Modificar"){
      this.productosBaja.forEach((p, i) => {
        if(p.idProducto==producto.idProducto){
          this.productosBaja[i]=this.form.value;
        }
      });
    }
    //this.renderizar();
    //this.establecerDatos();
    this.form.reset();

    this.accion='Crear'
      ///actualizamos los datos del localStorage
      this.servicioP.saveItems(this.productosBaja, observacion);
      
      ///
  }

  nuevo(){
    this.accion='Crear';
  }

  eliminar(id: number){
    ////datos de la cabecera
    let { observacion  } = this.formCabecera.value;
    /*
  En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
  asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
    */
    observacion = observacion ?? '';

    this.cargandoT=true;
    this.productosBaja.forEach((p, i) => {
      if(p.idProducto==id){
        console.log("eliminando")
        this.productosBaja.splice(i, 1);
       // delete(this.productosRecibidos[i]);
      }
    }); 
    console.log(this.productosBaja)
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      console.log('Destruyendo..');
      this.dtTrigger.next(0);
    })
    
    this.cargandoT = false;/////


    this.accion='Crear'
          ///actualizamos los datos del localStorage
          this.servicioP.saveItems(this.productosBaja, observacion);
      
          ///
  }

  modificar(producto:ProdEnBaja){
    this.accion='Modificar';
    this.form.setValue(producto);
  }

  buscar(){
    this.mostrarModal('smodal', true);
  }

  seleccionarProducto(i: Producto){
    this.form.get('idProducto')?.setValue(i.idProducto)
    this.form.get('nombre')?.setValue(i.nombre)
    this.mostrarModal('smodal', false); 
  }


  //faltan mensajes
  mensaje(field:string){
    let mensaje="";
    if(this.form.get(field)?.hasError('required')){
      if(field=="idProducto"){
        mensaje="El id es requerido..";
      }

      if(field=="nombre"){
        mensaje="El nombre es requerido..";
      }

      if(field=="cantidad"){
        mensaje="La cantidad es requerida..";
      }
    }

    if(this.form.get(field)?.hasError('min')){
      if(field == "cantidad"){
        mensaje="La cantidad mínima es 0";
      }
    }
    return mensaje;
  }

  datoInvalido(campo:string){
    let valido=(this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if(valido){
      input?.classList.add("is-invalid");
    }else if((this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.valid){
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

    let data={
      ...this.formCabecera.value,
      productos:this.productosBaja,
    }
    //validar que el nro de comprobante aun no se encuentre registrado en la fecha
    console.log(data)

    this.servicioP.registrarRecepcion(data).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        this.mensajeAlertify.mensajeExito(
          `La recepcion se ha registrado correctamente ✓✓`
        );
        this.limpiar();
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        console.log(errores);
        this.cargando = false;
      },
    });
  }

  limpiar(){
    this.servicioP.removerItems();
    this.formCabecera.reset();
    this.form.reset();

    //para evitar errores del datatable
    this.cargandoT=true;
    this.productosBaja=[];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      console.log('Destruyendo..');
      this.dtTrigger.next(0);
    })
    this.cargandoT=false;
   

  }

}