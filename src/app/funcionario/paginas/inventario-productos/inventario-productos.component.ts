import { Component, HostListener } from '@angular/core';
import { GuardarInventario, Producto, RespuestaDatosProducto } from '../../modelos/inv-rend.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-inventario-productos',
  templateUrl: './inventario-productos.component.html',
  styleUrls: ['./inventario-productos.component.css']
})
export class InventarioProductosComponent {

  productos: Producto[]=[]; //lista para tabla
  cargandoTabla:boolean = false; //obteniendo los datos a mostrar en la tabla
  
  invHabilitado:boolean=false;
  descripcion:string='';
  fechaApertura:Date | undefined;
  idCabeceraInv:number  | undefined;
  
  form:FormGroup=new FormGroup({}); //formulario para ingresar cantidades de productos
  cargandoOperacion!: boolean; //registro de inv en proceso
  
  dtOptions = {
    //deshabiitar ordenamiento
    ordering: false, // Deshabilitar el ordenamiento


    paging:false,
    info:false,
    responsive:true,
    searching: true,
    
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


  constructor(
    private mensajeAlertify: AlertifyService,
    private servicioI: InvRendService
  ) {
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  mensaje(campo:string){
    let mensaje="";
    if(this.form.get(campo)?.hasError('min')){
      mensaje='Minimo 0'
    }

    if(this.form.get(campo)?.hasError('required')){
      mensaje='Es requerido'
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

  enviar(){

    //Para mostrar error en las cantidades no establecidas de los productos 
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.mensajeAlertify.mensajeError('No agregó la cantidad de algún producto')
      return;
    }

    // this.mensajeAlertify.mensajeConfirmacion('Desea guardar el inventario',()=>{//todo:add

    this.cargandoOperacion = true;
    let inventario:GuardarInventario = {productos:this.form.value } ;
    // inventario.productos['11111']=88;

    this.servicioI.registrarInventario(inventario).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        //Luego de la apertura de inventario; en caso de que la rendicion de caja ya se haya registrado se mostrara el cierre de inventario con
        //los controladores resetados 
        this.consultarDetalle();
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

  /*FIXME:en caso que se cargue la pagina, se crean los controladores
  en caso de de que se recargue la tabla se limpian los controladores existentes*/
    consultarDetalle(){
      
      this.cargandoTabla = true;
      this.servicioI.obtenerDatosProducto()
      .subscribe({
        next:(respuesta:RespuestaDatosProducto)=>{
          console.log(respuesta)
          this.descripcion=respuesta.descripcion;
          this.fechaApertura=respuesta.fechaApertura;
          this.idCabeceraInv=respuesta.idCabeceraInv;
              
          if(respuesta.mostrar){
            this.invHabilitado=true;
            this.productos=respuesta.productos!;
            console.log(this.productos)
            
            this.productos.forEach(product => {
              const controlName = product.idProducto.toString();
              /*FIXME:
              Se verifica si el formulario (this.form) ya contiene un control con el nombre obtenido. 
              Si ya existen los controladores se limpian los mismos.
              Si aun no existen se crean
              */
            if (this.form.contains(controlName)) {
                  //Resetear un controlador: Usar reset() en un controlador existente restablecerá el valor del controlador a su valor inicial (no establece el valor inicial 0, por eso es mejor limpiarlos y establecer sus valores)
                  // this.form.get(controlName)?.reset();
                              
                  this.form.get(controlName)?.setValue(0); // Establece el valor a 0
                  this.form.get(controlName)?.markAsUntouched(); // Marca como no tocado
                  this.form.get(controlName)?.markAsPristine(); // Marca como no modificado
                  this.form.get(controlName)?.updateValueAndValidity(); // Actualiza la validez
              } else {
                  // Agrega un nuevo control si no existe un controlador con el nombre idProducto
                  this.form.addControl(controlName, new FormControl(0, [Validators.required, Validators.min(0)]));
              }
            });

            //TODO: Eliminar un controlador y luego agregarlo nuevamente: Si eliminas un controlador y luego lo agregas nuevamente, estás creando un nuevo controlador con las mismas propiedades. Esto es útil si deseas volver a crear completamente el controlador, incluidas sus validaciones y otros metadatos, y establecerlo en un estado específico.
            // this.productos.forEach(product => {

            //   const controlName = product.idProducto.toString();

            //   if (this.form.contains(controlName)) {
            //       this.form.removeControl(controlName); // Elimina el control existente
            //   }

            //   this.form.addControl(controlName, new FormControl(0, [Validators.required, Validators.min(0)]));
            // });
  
          }else{
            this.invHabilitado=false;
            //NO ES NECESARIO PQ SE RECARGA LA PAGINA
            // this.productos=[];
            // this.form.reset();
            // this.form= new FormGroup({});
          }
          this.cargandoTabla = false;      
        },
        error:(errores)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          
          this.cargandoTabla = false;
        }
      });
    }

  ////////prueba mensaje

  mostrarModal(id: string, mostrar:boolean) {
    if(mostrar){
      $(`#${id}`).modal('show');
    }else{
      $(`#${id}`).modal('hide');
    }
  }

  confirmarOperacionEnvio(){
      //prueba
      this.mostrarModal('modMensajeId',true)
  }

  //TODO:no se puede mostrar mensajes personalizados
  // canDeactivate(): boolean {
  //   // Lógica para determinar si el usuario puede salir del componente
  //   // Puedes devolver un valor booleano o un Observable<boolean>
  //   console.log('ejecutando can deactive')
  //   let salir=window.confirm('Desea recargar la pagina, las cantidades seran borradas si es que lo acepta !!');
  //   // return salir;
  //   return false;
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   if (!this.canDeactivate()) {
  //     // console.log('if de hostlistener')
  //     $event.returnValue = true;
  //   }
  //   // console.log('no if de hostlistener')
  // }

    //TODO: PARA MOSTRAR EL MENSAJE DE RECARGA POR DEFECTO DEL NAVEGADOR
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   $event.returnValue = true;
  // }

}
