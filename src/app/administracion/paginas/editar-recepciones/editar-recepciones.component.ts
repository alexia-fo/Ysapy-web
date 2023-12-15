import { Component } from '@angular/core';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CabeceraRecepcion, DatosDetalleInventario, RecepcionVisualizar, RespuestaCabeceraRecepcion, RespuestaDetalleInventario, RespuestaRecepcionesVisualizar } from '../../modelos/inventariosRegistrados';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecepcionProductosService } from 'src/app/funcionario/servicios/recepcion-productos.service';
import { Producto, RespuestaProductos } from 'src/app/funcionario/modelos/inv-rend.model';
import { GuardarRecepcion, ProdRecibido } from 'src/app/funcionario/modelos/recepcion-productos.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-editar-recepciones',
  templateUrl: './editar-recepciones.component.html',
  styleUrls: ['./editar-recepciones.component.css']
})
export class EditarRecepcionesComponent {
//id de cabecera de inventario
idCabecera!:number;
cargandoDatos=true; //obteniendo los datos
cabeceras:CabeceraRecepcion[]=[];//para la tabla

seleccionado!:CabeceraRecepcion;

modalVerDetalles='modalVerRecepciones';

detalles!:RecepcionVisualizar[];

/*FIXME: VARIABLES PARA AGREGAR UNA NUEVA RECEPCION */
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

  cargandoOperacion=false;//guardando la recepcion
  cargandoProductos=false; //obteniendo los datos de los productos a seleccionar
  cargandoTabRecepcion=false; //agregando-actualizando-quitando registros del datatable

  productos:Producto[]=[];//Productos disponibles para buscar y seleccionar en el modal
  productosRecibidos:ProdRecibido[]=[];//productos agregados a la tabla de recepciones

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
  private servivioRec:RecepcionProductosService,
  private router: Router,
  private fb: FormBuilder, 

  private route: ActivatedRoute,
){
}

// ngOnInit(): void {
//   this.formRecepcion.get('nombre')?.disable();//solo mostramos el nombre del producto 
    
//   this.cargandoDatos=true;
//   this.route.params // obtenemos el id de la cabecera desde la url
//   .pipe(
//     switchMap(params => {
//       this.idCabecera = params['idCabecera'];
//       return this.servicioC.obtenerCabecerasRecepciones(this.idCabecera); // una vez que obtenemos el id se realiza la consulta de las cabeceras de recepcion existentes
//     })
//   )
//   .subscribe({
//     next: (respuesta: RespuestaCabeceraRecepcion) => {
//       this.cabeceras=respuesta.cRecepcion;
//       this.cargandoDatos=false;
//     },
//     error: (errores) => {
//       errores.forEach((error: string) => {
//         this.mensajeAlertify.mensajeError(error);
//       });
//       this.cargandoDatos=false;
//     },
//   });
// }


// ...

ngOnInit(): void {
  this.formRecepcion.get('nombre')?.disable(); // solo mostramos el nombre del producto

  this.cargandoDatos = true;

  this.route.params.pipe(
    switchMap(params => {
      this.idCabecera = params['idCabecera'];

      // Utilizamos forkJoin para combinar las dos solicitudes en paralelo
      return forkJoin({
        detalleInventario: this.servicioC.obtenerDetalleInventario(this.idCabecera),
        cabecerasRecepciones: this.servicioC.obtenerCabecerasRecepciones(this.idCabecera)
      });
    })
  ).subscribe({
    next: (respuestas: {detalleInventario: RespuestaDetalleInventario,cabecerasRecepciones:RespuestaCabeceraRecepcion }) => {
      // Aquí puedes acceder a respuestas.detalleInventario y respuestas.cabecerasRecepciones
      this.detalleInventario = respuestas.detalleInventario.detalleInventario;
      this.cabeceras = respuestas.cabecerasRecepciones.cRecepcion;
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


seleccionar(seleccionado: CabeceraRecepcion){
  this.seleccionado = seleccionado;

  this.servicioC.obtenerDetalleRecepcionCab(this.idCabecera, this.seleccionado.idRecepcion)
  .subscribe({
    next: (respuesta: RespuestaRecepcionesVisualizar) => {
      this.detalles=respuesta.dRecepcion;
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
  this.servicioC.modificarEstadoRecepcion(this.seleccionado.idRecepcion)
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

  this.servivioRec.productosRecepcion()
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
  this.formRecepcion.get('idProducto')?.setValue(i.idProducto)
  this.formRecepcion.get('nombre')?.setValue(i.nombre)
  this.mostrarModal(this.modalBuscar, false); 
  this.mostrarModal(this.modalAgregarNuevo, true); 

}

buscar(){
  this.mostrarModal(this.modalAgregarNuevo, false)
  this.mostrarModal(this.modalBuscar, true);
}

modificar(producto:ProdRecibido){
  this.accion='Modificar';
  this.formRecepcion.setValue(producto);
  //todo:error solucionando
  this.idProductoSeleccionado=producto.idProducto;
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
  //TODO:CORREGIR ERROR
  // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   dtInstance.destroy();
  //   this.dtTrigger.next(0);
  // })
  
  //TODO:CORREGIR ERROR de datatable
  setTimeout(() => {
    this.cargandoTabRecepcion = false;      
  }, 0.1);

  this.accion='Crear'
  ///actualizamos los datos del localStorage
 }

 agregar(){

  //para validar campos dehabilitados pq no se incluyen en el formRecepcion.valid
  if(!(this.formRecepcion.get('idProducto')?.value || this.formRecepcion.get('nombre')?.value || this.idProductoSeleccionado)){
    this.mensajeAlertify.mensajeError('Seleccione el producto');
    return;
  }

  //para validar la cantidad del producto que es campo habilitado o editable
  if(!this.formRecepcion.valid){
    this.formRecepcion.markAllAsTouched();
    return;
  }

  // let { observacion , nroComprobante } = this.formCabecera.value;
  
  /*TODO: utilizamos el operador de coalescencia nula (??) para 
  asignar un valor predeterminado de cadena vacía ('') a observacion y nroComprobante 
  en caso de que sean null. De esta manera, te aseguras de que ambos valores sean cadenas 
  de texto y evitas el error de asignación.*/
  
  // observacion = observacion ?? '';
  // nroComprobante = nroComprobante ?? '';
 
  let producto: ProdRecibido = this.formRecepcion.value;
  //obtenemos los valores de los compos deshabilitados, se puede utilizar solo el metodo this.form.getRawValue()
  // producto.idProducto=this.formRecepcion.get('idProducto')?.value;
  producto.idProducto=this.idProductoSeleccionado;
  producto.nombre=this.formRecepcion.get('nombre')?.value;

  let bandera=false;
  this.cargandoTabRecepcion= true;
  if(this.accion=="Crear"){

    //this.productosRecibidos.push(producto);
    this.productosRecibidos.forEach((p, i) => {
      if(p.idProducto==producto.idProducto){
        this.productosRecibidos[i].cantidad=this.productosRecibidos[i].cantidad+producto.cantidad;//ya esta validado con el form.markAllAsTouched();
        bandera=true;
        //TODO:CORREGIR ERROR
        setTimeout(() => {
          this.cargandoTabRecepcion = false;
        }, 0.1);
      }
    });

    if(!bandera){
      this.productosRecibidos.push(producto);
      //TODO:CORREGIR ERROR
      // this.cargandoTabRecepcion = false;
      setTimeout(() => {
        this.cargandoTabRecepcion = false;
      }, 0.1);

    }

  }else if(this.accion=="Modificar"){
    this.cargandoTabRecepcion=true;

    this.productosRecibidos.forEach((p, i) => {
      if(p.idProducto==producto.idProducto){
        this.productosRecibidos[i]=this.formRecepcion.value;
      }
    });

    //TODO:CORREGIR ERROR
    // this.cargandoTabRecepcion = false;
    setTimeout(() => {
      this.cargandoTabRecepcion = false;
    }, 0.1);

  }

  this.limpiarDetalle();

  this.accion='Crear'
  // this.mostrarModal(this.modalAgregarNuevo, false);  
}

limpiarDetalle(){
  this.formRecepcion.reset();
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

  //FIXME: se limpian todos los formularios y tabla para que la pagina se limpie sin recargar
  borrarDatos(){
    this.formCabecera.reset();
    this.formRecepcion.reset();

    //para evitar errores del datatable
    this.cargandoTabRecepcion=true;
    this.productosRecibidos=[];

    this.cargandoTabRecepcion=false;
  }


  //guardar recepciones agregadas 
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

    // this.mensajeAlertify.mensajeConfirmacion('Desea guardar el inventario',()=>{//todo:add

    let data:GuardarRecepcion={
      nroComprobante: this.formCabecera.value.nroComprobante || "",
      observacion:this.formCabecera.value.observacion || "",
      productos:this.productosRecibidos,

    }

    this.cargandoOperacion = true;
    this.servicioC.registrarRecepcion(data, this.idCabecera).subscribe({
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
