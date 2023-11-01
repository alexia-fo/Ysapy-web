import { Component } from '@angular/core';
import { TablaItemPipe } from 'src/app/utilidades/modelos/modal-buscar.model';
import { EliminadoInformaicion, Informacion, RespuestaInformaciones } from '../../modelos/informacion.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { BooleanToStringPipe } from 'src/app/utilidades/pipes/boolean-to-string.pipe';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { ImagenService } from 'src/app/utilidades/servicios/imagenes/imagen.service';
import { ImagenesService } from 'src/app/utilidades/servicios/imagenes/imagenes.service';
import { FormatosService } from 'src/app/validaciones/formatos.service';
import { InformacionService } from '../../servicios/informacion.service';

@Component({
  selector: 'app-abmc-informacion',
  templateUrl: './abmc-informacion.component.html',
  styleUrls: ['./abmc-informacion.component.css']
})
export class AbmcInformacionComponent {
  
  //id del modal para mostrarlo u ocultarlo mediante jquery (mediante los id's establecidos a cada modal se puede manipular más de uno en un mismo componente)
  //se puede ocultar un modal y mostrar otro y viceversa
  modInforamacionId='modalInformacion';

   //listado de sucursales que se van a mostrar en la tabla
   tabla:Informacion[]=[];

  //almacena el objeto de la fila (a editar o eliminar) seleccionada en la tabla 
  //se utiliza para agregar los valores al formulario - tambien se utiliza para obtener el id de la informacion editado a actualiar
  seleccionado!: Informacion; 

  form!: FormGroup; 

  //crear-modificar-eliminar (se le envia como parametro al modal para habilitar o deshabilitar botones)
  //tambien se utiliza al momento de guardar para verificar si se insertara un nuevo registro o se actualizara uno existenete
  accion!: 'C' | 'M' | 'E'; 

  //para verificar si la operacion crud esta en proceso (se utiliza para habilitar o deshabilitar botones, mostrar u ocultar el loading)
  cargandoOperacion: boolean = false; 

  //La propiedad "cargandoTabla" evita que en el datatable haya errores si se retrasa la obtencion de datos;
  //si la tabla no utiliza el ngIf para validar que ya se cuenta con los datos, la misma igual se construye y muestra el mensaje "No hay datos 
  //disponibles en la tabla" cuando la obtencion de datos esta pendiente, luego de que se haya completado, la tabla ya no se actualiza 
  //pq el datatable solo tiene en cuenta los datos inciales(vacío al momento de construir la tabla), por esta razon
  //muestra con el paginado incorrecto y ademas el mensaje "No hay datos disponibles en la tabla" se muestra al final
  cargandoTabla = true; //obteniendo los datos a mostrar en la tabla

  dtOpciones: DataTables.Settings = {//configuracion del datatable
    paging: true,
    responsive:true,
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

  //------- IMAGENES DE PRODUCTOS ---------//
  apiUrl=`${environment.API_URL}/api/uploads/informaciones/`; //ruta del API (se usa para mostrar la imagen actual de un producto seleccinado para modificar)
  
  cargandoImagen:boolean=false; // si se está guardando imagen (para deshabilitar botones)

  archivos:any=[]; // imagen seleccionada (se utiliza al momento de guardar)
  
  previsualizacion!:string; //imagen en base 64 (para la previsualizacion de la imagen en el html)
  
  formImagen!:FormGroup; //formulario independiente para guardar las imagenes, sin el resto de los datos

  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioConvImg: ImagenService,
    private servicioImagen:ImagenesService,
    private formatos: FormatosService,
    private servicioI:InformacionService,
  ) {
  }

  ngOnInit(): void {
    //para evitar errores se inicializan los formularios, luego se volveran a inicializar por cada accion

    this.instanciarFormulario();

    this.instanciarFormularioImagen();

    this.obtenerInformaciones();
  }


  instanciarFormulario(){
    this.form=this.formulario.group({   
      titulo:['',[Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      descripcion:['', [Validators.required, Validators.maxLength(250)]],//[Validators.required, Validators.minLength(5), Validators.maxLength(200)]
      fecha:['', []]
    });
  }

  //requiere de validaciones asincronas por eso requiere que el formulario se instancia al crear 
  //nuevo y al modificar un producto
  nuevo() {
    //instanciar el formulario y luego cargar el combo de clasificaciones
    this.accion="C";

    ///limpiar formulario por si se uso el de modificacion
    this.form.reset();

    //mostrar el modal
    this.mostrarModal(this.modInforamacionId, true);
  }
 
  guardar() {
    
    if (!this.form.valid) {
      //los mensajes de error se visualizaran al marcar los input como tocados
      this.form.markAllAsTouched();
      return;
    }

    if(this.formPendiente){
      //no se registraran mientras la validacion asincrona no finalice
      return;
    }

    this.cargandoOperacion = true; //coienza la operacion de insercion
    let { ...informacion } = this.form.value;

    console.log(informacion)

    if (this.accion == 'C') {
      this.servicioI.crear(informacion).subscribe({
        next: (respuesta: Informacion) => {
          this.mostrarModal(this.modInforamacionId, false);
          this.cargandoOperacion = false;
          this.obtenerInformaciones();
          this.mensajeAlertify.mensajeExito(
            `${respuesta.titulo} se ha insertado correctamente ✓✓`
          );
        },
        error: (errores: string[]) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          this.cargandoOperacion = false;
        },
      });
    } else if (this.accion == 'M') {
      this.servicioI
        .actualizar(this.seleccionado.idInformacion, informacion)
        .subscribe({
          next: (respuesta: Informacion) => {
            this.mostrarModal(this.modInforamacionId, false)
            this.cargandoOperacion = false;
            this.obtenerInformaciones();
            this.mensajeAlertify.mensajeExito(
              `${respuesta.titulo} se ha actualizado correctamente ✓✓`
            );
          },
          error: (errores) => {
            errores.forEach((error: string) => {
              this.mensajeAlertify.mensajeError(error);
            });
            this.cargandoOperacion = false;
          },
      });
    }
  }
    
  eliminar() {
    this.cargandoOperacion=true; //empieza la operacion
    this.mostrarModal(this.modInforamacionId, false);
    this.mensajeAlertify.mensajeConfirmacion(`Confirma la anulacion del producto ${this.seleccionado.titulo}`,()=>{
      this.servicioI.eliminar(this.seleccionado.idInformacion).subscribe({
        next: (respuesta: EliminadoInformaicion) => {
          this.cargandoOperacion = false;
          this.obtenerInformaciones();
          this.mensajeAlertify.mensajeExito(
            `${respuesta.informacion.titulo} se ha anulado correctamente ✓✓`
          );
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          this.cargandoOperacion = false;
        },
      })
    })
  }


  mensaje(campo:string){
    let mensaje="";
    if(this.form.get(campo)?.hasError('required')){
      if(campo=="fecha"){
        mensaje="La fecha es requerida";
      }

      if(campo=="descripcion"){
        mensaje="La descripcion es requerida";
      }

      if(campo=="titulo"){
        mensaje="El titulo es requerido";
      }
    }

    if(this.form.get(campo)?.hasError('minlength')){
      if(campo == "titulo"){
        mensaje="El título debe contener minimo 5 caracteres";
      }
    }

    if(this.form.get(campo)?.hasError('maxlength')){
      if(campo == "titulo"){
        mensaje="Titulo: Máximo 200 caracteres";
      }
      if(campo == "descripcion"){
        mensaje="Descripcion: max 250 caracteres";
      }
    }
    
    return mensaje;
  }

  //para agregar clases que marquen los inputs validos y no validos
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

  // -- PARA RECARGAR TABLA --//
  obtenerInformaciones() {
    this.cargandoTabla=true;
    this.servicioI.obtenerInformaciones().subscribe({
      next: (respuesta: RespuestaInformaciones) => {
        this.tabla = respuesta.informacion;
        this.cargandoTabla = false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoTabla=false;
      },
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

  obtenerSeleccionado(informacion: Informacion) {

    console.log("seleccionado", informacion)

    //para limpiar la imagen anteriormente seleccionada
    this.limpiarArchivo();
    this.accion="M";
    ///limpiar formulario por si se uso el de nuevo
    this.form.reset();
    this.seleccionado = {...informacion};
    this.form.patchValue(this.seleccionado)
    this.mostrarModal(this.modInforamacionId, true);
  }




  // -------- imagen -----------------// 

  capturarArchivo(event:any){
    if(event.target.files[0]){
      const archivoCapturado=event.target.files[0];
      this.servicioConvImg.extraerBase64(archivoCapturado).then((imagen:any)=>{
        this.previsualizacion=imagen.base;
      })
      this.archivos.push(archivoCapturado);
    }
  }

  subirArchivo(){

    //para verificar si se ha seleccionado una imagen
    if (!this.formImagen.valid) {
      this.formImagen.markAllAsTouched();
      return;
    }

    try{
      this.cargandoImagen=true;
      const formularioDeDatos = new FormData();
      this.archivos.forEach((archivo:any) => {
        formularioDeDatos.append('archivo', archivo);
      });
      this.servicioImagen.crear(this.seleccionado.idInformacion, "informaciones", formularioDeDatos)
      .subscribe({
        next:(response)=>{
          
          // Llama a la función para recargar la página, pq si no se recarga la url sigue siendo la misma y el navegador sigue mostrando la misma imagen
          //si se vuelve a ver la misma imagen sin recargar          
          this.mostrarModal(this.modInforamacionId, false);
          this.mensajeAlertify.mensajeExito('Imagen actualizada');
          // Continuar con la recarga de la página después de mostrar el mensaje
          setTimeout(() => {
            /*window.location.reload(), se recarga la página por completo, lo que significa 
            que se recargará todo el HTML, CSS, JavaScript y se reiniciarán las solicitudes 
            de red, incluyendo las consultas a servidores o API.*/
            window.location.reload();
          }, 1000); // Esperar 1 segundo antes de recargar la página

          this.cargandoImagen=false;
          this.limpiarArchivo();
        },
        error:(errores:any)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          this.cargandoImagen = false;
        }
      })
    }catch(errores: any){
      this.mensajeAlertify.mensajeError('Error en el front al guardar la imagen');
      this.cargandoImagen = false;
    }
  }

  limpiarArchivo(){
    this.formImagen.reset();
    this.archivos=[]
    this.previsualizacion='';
  }

  mensajeArchivo(campo:string){
    let mensaje="";
    if(this.formImagen.get(campo)?.hasError('required')){
      if(campo=="imagenControl"){
        mensaje="La imagen es requerida..";
      }
    }

    if(this.formImagen.get(campo)?.hasError('formatoInvalido')){
      if(campo == "imagenControl"){
        mensaje="Los formatos validos son: png, jpg, jpeg, gif";
      }

    }
    return mensaje;
  }

  archivoInvalido(campo:string){
    return (this.formImagen.get(campo)?.touched || this.formImagen.get(campo)?.dirty) && this.formImagen.get(campo)?.invalid;
  }

  instanciarFormularioImagen(){
    this.formImagen=this.formulario.group({
      imagenControl:['', [Validators.required, this.formatos.validarFormatoImagen]] 
    });
  }

  get formPendiente(){
    const nombreControl = this.form.get('nombre');
    return (this.form.pending && nombreControl!.touched);
  }
}
