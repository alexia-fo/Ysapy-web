import { Component } from '@angular/core';
import { CabeceraSalida, DatosDetalleInventario, RespuestaCabeceraSalida, RespuestaDetalleInventario, RespuestaSalidasVisualiza, SalidasVisualiza } from '../../modelos/inventariosRegistrados';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto, RespuestaProductos } from 'src/app/funcionario/modelos/inv-rend.model';
import { GuardarSalida, ProdEnBaja } from 'src/app/funcionario/modelos/salida-productos.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { SalidaProductosService } from 'src/app/funcionario/servicios/salida-productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-editar-salidas',
  templateUrl: './editar-salidas.component.html',
  styleUrls: ['./editar-salidas.component.css']
})
export class EditarSalidasComponent {
//id de cabecera de inventario
idCabecera!:number;
cargandoDatos=true; //obteniendo los datos
cabeceras:CabeceraSalida[]=[];//para la tabla

seleccionado!:CabeceraSalida;

modalVerDetalles='modalVerSalidas';

detalles:SalidasVisualiza[]=[];

/*FIXME: VARIABLES PARA AGREGAR UNA NUEVA RECEPCION */
  //los formularios para cabecera y detalle son independientes
  formCabecera=this.fb.group({
    observacion:[''],
  });

  formSalida:FormGroup=this.fb.group({
    idProducto:['', [Validators.required]],
    nombre:['', [Validators.required]],
    cantidad:['', [Validators.required, Validators.min(1)]],
  });

  cargandoOperacion=false;//guardando la recepcion
  cargandoProductos=false; //obteniendo los datos de los productos a seleccionar
  cargandoTabSalida=false; //agregando-actualizando-quitando registros del datatable

  productos:Producto[]=[];//Productos disponibles para buscar y seleccionar en el modal
  productosRecibidos:ProdEnBaja[]=[];//productos agregados a la tabla de recepciones

  modalAgregarNuevo='modalNuevo';
  modalBuscar='modalBuscarProducto';

  idProductoSeleccionado!:number;//producto seleccionado en buscar

  accion:'Crear' | 'Modificar' | 'Eliminar'='Crear';
  proximoNroComprobante!:number; //aun no se esta utilizando es decir, no se obtiene el ultimo para establecer el siguiente


  detalleInventario!:DatosDetalleInventario[];

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

constructor(
  private mensajeAlertify: AlertifyService,
  private servicioC: InventariosRegistradosService,
  private servicioSalida:SalidaProductosService,
  private router: Router,
  private fb: FormBuilder, 

  private route: ActivatedRoute,
){
}

ngOnInit(): void {
  this.formSalida.get('nombre')?.disable(); // solo mostramos el nombre del producto

  this.cargandoDatos = true;

  this.route.params.pipe(
    switchMap(params => {
      this.idCabecera = params['idCabecera'];

      // Utilizamos forkJoin para combinar las dos solicitudes en paralelo
      return forkJoin({
        detalleInventario: this.servicioC.obtenerDetalleInventario(this.idCabecera),
        cabecerasSalidas: this.servicioC.obtenerCabecerasSalidas(this.idCabecera)
      });
    })
  ).subscribe({
    next: (respuestas: {detalleInventario: RespuestaDetalleInventario,cabecerasSalidas:RespuestaCabeceraSalida }) => {
      // Aquí puedes acceder a respuestas.detalleInventario y respuestas.cabecerasRecepciones
      this.detalleInventario = respuestas.detalleInventario.detalleInventario;
      this.cabeceras = respuestas.cabecerasSalidas.cSalida;
      this.cargandoDatos = false;
      console.log('detalleInventario, ', this.detalleInventario)
    },
    error: (errores) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoDatos = false;
    },
  });
}


seleccionar(seleccionado: CabeceraSalida){
  console.log('seleccionado, ', seleccionado)
  this.seleccionado = seleccionado;
  console.log('this.seleccionado, ', this.seleccionado)

  this.servicioC.obtenerDetalleSalidaCab(this.idCabecera, this.seleccionado.idCabecera)
  .subscribe({
    next: (respuesta: RespuestaSalidasVisualiza) => {
      this.detalles=respuesta.dSalida;
      console.log(respuesta)
      this.cargandoDatos=false;

      this.mostrarModal(this.modalVerDetalles, true);
    },
    error: (errores) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoDatos=false;
    },
  });
}

mostrarModal(id: string, mostrar:boolean) {
  if(mostrar){
    $(`#${id}`).modal('show');
  }else{
    $(`#${id}`).modal('hide');
  }
}


anular(){
  this.servicioC.modificarEstadoSalida(this.seleccionado.idCabecera)
  .subscribe({
    next: (respuesta: respuestaMensaje) => {
      this.mensajeAlertify.mensajeExito(respuesta.msg);


      // this.detalles=respuesta.dRecepcion;
      // console.log(respuesta)
      // this.cargandoDatos=false;

      this.mostrarModal(this.modalVerDetalles, false);
    },
    error: (errores) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoDatos=false;
    },
  });
}


//TODO: TODOS LOS METODOS NECESARIOS PARA AGREGAR UNA NUEVA RECEPCION


nuevo(){
  this.cargandoProductos=true;

  this.servicioSalida.productosSalida()
  .subscribe({
    next:(respuesta:RespuestaProductos)=>{
      this.productos=respuesta.producto;
      this.cargandoProductos=false;

      this.mostrarModal(this.modalAgregarNuevo, true);
    },
    error:(errores)=>{
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoProductos=false;
    }
  })
}

seleccionarProducto(i: Producto){
  //establecemos el valor del idProducto para luego guardar el mismo en el array y no el obtenido desde el formulario ya que se puede editar
  this.idProductoSeleccionado=i.idProducto;
  //settear los campos deshabilitados del formulario
  this.formSalida.get('idProducto')?.setValue(i.idProducto)
  this.formSalida.get('nombre')?.setValue(i.nombre)
  this.mostrarModal(this.modalBuscar, false); 
  this.mostrarModal(this.modalAgregarNuevo, true); 

}

buscar(){
  this.mostrarModal(this.modalAgregarNuevo, false)
  this.mostrarModal(this.modalBuscar, true);
}

modificar(producto:ProdEnBaja){
  this.accion='Modificar';
  this.formSalida.setValue(producto);
  //todo:error solucionando
  this.idProductoSeleccionado=producto.idProducto;
}

eliminar(id: number){
  this.accion='Eliminar';

  let { observacion } = this.formCabecera.value;
  /*
  En este ejemplo, utilizamos el operador de coalescencia nula (??) para 
  asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas de texto y evitas el error de asignación.
  */
  observacion = observacion ?? '';

  this.cargandoTabSalida=true;
  this.productosRecibidos.forEach((p, i) => {
    if(p.idProducto==id){
      this.productosRecibidos.splice(i, 1);
     // delete(this.productosRecibidos[i]);
    }
  }); 
  //TODO:CORREGIR ERROR
  // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   dtInstance.destroy();
  //   this.dtTrigger.next(0);
  // })
  
  //TODO:CORREGIR ERROR de datatable
  setTimeout(() => {
    this.cargandoTabSalida = false;      
  }, 0.1);

  this.accion='Crear'
  ///actualizamos los datos del localStorage
 }

 agregar(){

  //para validar campos dehabilitados pq no se incluyen en el formRecepcion.valid
  if(!(this.formSalida.get('idProducto')?.value || this.formSalida.get('nombre')?.value || this.idProductoSeleccionado)){
    this.mensajeAlertify.mensajeError('Seleccione el producto');
    return;
  }

  //para validar la cantidad del producto que es campo habilitado o editable
  if(!this.formSalida.valid){
    this.formSalida.markAllAsTouched();
    return;
  }

  // let { observacion , nroComprobante } = this.formCabecera.value;
  
  /*TODO: utilizamos el operador de coalescencia nula (??) para 
  asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante 
  en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas 
  de texto y evitas el error de asignación.*/
  
  // observacion = observacion ?? '';
  // nroComprobante = nroComprobante ?? '';
 
  let producto: ProdEnBaja = this.formSalida.value;
  //obtenemos los valores de los compos deshabilitados, se puede utilizar solo el metodo this.form.getRawValue()
  // producto.idProducto=this.formRecepcion.get('idProducto')?.value;
  producto.idProducto=this.idProductoSeleccionado;
  producto.nombre=this.formSalida.get('nombre')?.value;

  let bandera=false;
  this.cargandoTabSalida= true;
  if(this.accion=="Crear"){

    //this.productosRecibidos.push(producto);
    this.productosRecibidos.forEach((p, i) => {
      if(p.idProducto==producto.idProducto){
        this.productosRecibidos[i].cantidad=this.productosRecibidos[i].cantidad+producto.cantidad;//ya esta validado con el form.markAllAsTouched();
        bandera=true;
        //TODO:CORREGIR ERROR
        setTimeout(() => {
          this.cargandoTabSalida = false;
        }, 0.1);
      }
    });

    if(!bandera){
      this.productosRecibidos.push(producto);
      //TODO:CORREGIR ERROR
      // this.cargandoTabRecepcion = false;
      setTimeout(() => {
        this.cargandoTabSalida = false;
      }, 0.1);

    }

  }else if(this.accion=="Modificar"){
    this.cargandoTabSalida=true;

    this.productosRecibidos.forEach((p, i) => {
      if(p.idProducto==producto.idProducto){
        this.productosRecibidos[i]=this.formSalida.value;
      }
    });

    //TODO:CORREGIR ERROR
    // this.cargandoTabRecepcion = false;
    setTimeout(() => {
      this.cargandoTabSalida = false;
    }, 0.1);

  }

  this.limpiarDetalle();

  this.accion='Crear'
  // this.mostrarModal(this.modalAgregarNuevo, false);  
}

limpiarDetalle(){
  this.formSalida.reset();
}

mensaje(field:string){
  let mensaje="";
  if(this.formSalida.get(field)?.hasError('required')){
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

  //FIXME: se limpian todos los formularios y tabla para que la pagina se limpie sin recargar
  borrarDatos(){
    this.formCabecera.reset();
    this.formSalida.reset();

    //para evitar errores del datatable
    this.cargandoTabSalida=true;
    this.productosRecibidos=[];

    this.cargandoTabSalida=false;
  }


  //guardar recepciones agregadas 
  guardar(){

    if(this.productosRecibidos.length<1){
      this.mensajeAlertify.mensajeError(
        `Agregue al menos 1 producto !!`
      );
      return;
    }

    // this.mensajeAlertify.mensajeConfirmacion('Desea guardar el inventario',()=>{//todo:add

    let data:GuardarSalida={
      observacion:this.formCabecera.value.observacion || "",
      productos:this.productosRecibidos,

    }

    this.cargandoOperacion = true;
    this.servicioC.registrarSalida(data, this.idCabecera).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        this.borrarDatos();

        //!
        // this.formCabecera.get('nroComprobante')?.setValue((this.proximoNroComprobante+1).toString());
        // this.obtenerDatosRec()
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoOperacion = false;
      },
    });

    
  // })//todo:add


  }


}
