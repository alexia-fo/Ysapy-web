import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DatosProductos, EliminadoProducto, Producto, RespuestaProductos } from '../../modelos/producto.model';
import { Clasificacion, RespuestaClasificaciones } from '../../modelos/clasificacion.model';
import { ProductoService } from '../../servicios/producto.service';
import { ClasificacionService } from '../../servicios/clasificacion.service';
import { FormatosService } from 'src/app/validaciones/formatos.service';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { ImagenService } from 'src/app/utilidades/servicios/imagenes/imagen.service';
import { ImagenesService } from 'src/app/utilidades/servicios/imagenes/imagenes.service';
import { TablaItemPipe } from 'src/app/utilidades/modelos/modal-buscar.model';
import { BooleanToStringPipe } from 'src/app/utilidades/pipes/boolean-to-string.pipe';
import { DecimalPipe } from '@angular/common';
import { Validaciones } from 'src/app/validaciones/bd';
import { Marca } from '../../modelos/marca.model';
import { Unidad } from '../../modelos/unidad.model';

@Component({
  selector: 'app-product',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit{

  //Instanciar los pipes para la tabla
  stringPipe:BooleanToStringPipe= new BooleanToStringPipe();
  //decimalPipe: DecimalPipe = new DecimalPipe('en-US'); // Puedes ajustar la configuración de localización según tus necesidades
  //todo:la configuracion global del pipe solo afecta a los pipes utilizados en el html no a los instacidos en el ts
  decimalPipe: DecimalPipe = new DecimalPipe('es-PY'); // Puedes ajustar la configuración de localización según tus necesidades
  
  //id del modal para mostrarlo u ocultarlo mediante jquery (mediante los id's establecidos a cada modal se puede manipular más de uno en un mismo componente)
  //se puede ocultar un modal y mostrar otro y viceversa
  modProductoId='modalProducto';

  //para construir la tabla se requieren ciertos datos como las propiedades, que corresponden a los campos retornados de la BD mediante el backend;
  //los datos, corresponde al array de informacion que se quiere listar 
  //los campos son los encabezados que tendrá la tabla (las propiedades y los campos deben estar en el mismo orden)
  
  //TODO:tabla sin pipes
  // tabla:TablaItem<Producto>={ //propiedades de la tabla para el listado
  //   propiedades: ['idProducto','nombre', 'precio', 'descripcion', 'activo', 'facturable', 'Usuario.nombre'], 
  //   datos: [], 
  //   campos:['Id', 'Producto', 'Precio', 'Descripcion', 'Clasificacion', 'Activo', 'Facturable', 'Usuario'], 
  // }

  //utilizar pipes instanciados para formatear los datos
  //!para no utilizar el compoenente reutilizable
  // tabla:TablaItemPipe<Producto>={ //propiedades de la tabla para el listado
  //   propiedades: [{campo:'idProducto'}, {campo:'nombre'}, {campo: 'precio', pipe:this.decimalPipe}, {campo:'descripcion'}, {campo:'Clasificacion.nombre'}, {campo:'activo', pipe:this.stringPipe}, {campo:'facturable', pipe:this.stringPipe}, {campo:'Usuario.nombre'}], 
  //   datos: [], 
  //   campos:['Id', 'Producto', 'Precio', 'Descripcion', 'Clasificacion', 'Activo', 'Facturable', 'Usuario'], 
  // }
  productos!:Producto[];

  //almacena el objeto de la fila (a editar o eliminar) seleccionada en la tabla 
  //se utiliza para agregar los valores al formulario - tambien se utiliza para obtener el id del producto editado a actualiar
  seleccionado!: Producto; 

  //formulario para crear y modificar registros (en este caso se instancia más de una vez, se instancia cuando se va a ralizar una creacion
  //y cuando se va a hacer una modificacion, porque requiere de validaciones asincronas: cuando es una modificación se envia al validador del nombre, el nombre a modificar,
  //que no se deberia tener en cuenta al verificar si el nombre ya se encuentra almacenado en la BD)
  //para las validaciones asincronas es necesario que al instanciar el formulario ya se le envie los parametros necesarios para validarlo
  form!: FormGroup; 
  //formInstanciado: boolean = false; // no es necesario pq el fomulario se instancia una sola vez pq no requiere de validaciones asincronas

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
    paging: false,
    responsive:false,
    info: true,
    // pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    /*
    lengthMenu: [5, 10, 15, 20],//habilita el selector de cantidad de registros con los siguiente numeros (lengthChange: false --> debe quitarse para que funcione)
    */
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 5, // establece la cantidad de registros por página en 10

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

  //------- CLASIFICACIONES DE PRODUCTOS ---------//

  //para controlar que una vez que se obtengan las clasificaciones se establezcan los datos a editar o sino la clasificacion no se mostrará
  //( también se usa para mostrar un loading de obtencion de datos)
  cargandoComboClasif=false;  
  
  clasificaciones!:Clasificacion[]; //para el combo de clasificaciones

  //------- IMAGENES DE PRODUCTOS ---------//
  apiUrl=`${environment.API_URL}/api/uploads/productos/`; //ruta del API (se usa para mostrar la imagen actual de un producto seleccinado para modificar)
  
  cargandoImagen:boolean=false; // si se está guardando imagen (para deshabilitar botones)

  archivos:any=[]; // imagen seleccionada (se utiliza al momento de guardar)
  
  previsualizacion!:string; //imagen en base 64 (para la previsualizacion de la imagen en el html)
  
  formImagen!:FormGroup; //formulario independiente para guardar las imagenes, sin el resto de los datos

  //TODO:
  //ya no es necesario pq al instaciar en el ngOnInit una vez como "crear" se evita el error
  //formInstanciado=false; //ya que al modificar o crear nuevo, recien se instancia el formulario, el html genera error pq ya se requiere al visualizar el modal 


  //add
  marcas:Marca[]=[];
  unidades:Unidad[]=[];
  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioProd: ProductoService,
    private servicioClasif:ClasificacionService,
    private servicioConvImg: ImagenService,
    private servicioImagen:ImagenesService,
    private formatos: FormatosService,
  ) {
  }

  ngOnInit(): void {
    //para evitar errores se inicializan los formularios, luego se volveran a inicializar por cada accion
    this.instanciarFormularioDatos(false);
    this.instanciarFormularioImagen();

    this.obtenerProductos();
  }


  //requiere de validaciones asincronas por eso requiere que el formulario se instancia al crear 
  //nuevo y al modificar un producto
  nuevo() {
    //instanciar el formulario y luego cargar el combo de clasificaciones
    this.accion="C";
    this.instanciarFormularioDatos(false);
    this.obtenerClasificaciones(false);

    //mostrar el modal
    this.mostrarModal(this.modProductoId, true);
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
    let { ...producto } = this.form.value;

    if (this.accion == 'C') {
      this.servicioProd.crear(producto).subscribe({
        next: (respuesta: Producto) => {
          this.mostrarModal(this.modProductoId, false);
          this.cargandoOperacion = false;
          this.obtenerProductos();
          this.mensajeAlertify.mensajeExito(
            `${respuesta.nombre} se ha insertado correctamente ✓✓`
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
      this.servicioProd
        .actualizar(this.seleccionado.idProducto, producto)
        .subscribe({
          next: (respuesta: Producto) => {
            this.mostrarModal(this.modProductoId, false)
            this.cargandoOperacion = false;
            this.obtenerProductos();
            this.mensajeAlertify.mensajeExito(
              `${respuesta.nombre} se ha actualizado correctamente ✓✓`
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
    this.mostrarModal(this.modProductoId, false);
    this.mensajeAlertify.mensajeConfirmacion(`Confirma la anulacion/habilicion del producto ${this.seleccionado.nombre}`,()=>{
      this.servicioProd.eliminar(this.seleccionado.idProducto).subscribe({
        next: (respuesta: EliminadoProducto) => {
          this.cargandoOperacion = false;
          this.obtenerProductos();
          this.mensajeAlertify.mensajeExito(
            `${respuesta.producto.nombre} se ha anulado correctamente ✓✓`
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
      if(campo=="nombre"){
        mensaje="El nombre es requerido";
      }
      
      if(campo=="precio"){
        mensaje="El precio es requerido";
      }

      if(campo=="idclasificacion"){
        mensaje="La clasificación es requerida";
      }

      //add
      if(campo=="idmarca"){
        mensaje="La marca es requerida";
      }

      if(campo=="idunidad"){
        mensaje="La unidad de medida es requerida";
      }

      //fin
      if(this.accion=='M'){
        if(campo=="facturable"){
          mensaje="Facturable requerido";
        }
      }
    }

    if(this.form.get(campo)?.hasError('minlength')){
      if(campo == "nombre"){
        mensaje="Nombre: min 3 caracteres";
      }

    }

    if(this.form.get(campo)?.hasError('maxlength')){
      if(campo == "nombre"){
        mensaje="Nombre: max 100 caracteres";
      }
      if(campo == "descripcion"){
        mensaje="Nombre: max 200 caracteres";
      }
    }

    if(this.form.get(campo)?.hasError('min')){
      if(campo == "precio"){
        mensaje="Precio: mínimo = 0";
      }
    }

    // validacion asincrona
    if(this.form.get(campo)?.hasError('not_available')){
      mensaje="El nombre ya está registrado";
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
  obtenerProductos() {
    this.cargandoTabla=true;
    this.servicioProd.obtenerProductos().subscribe({
      next: (respuesta: RespuestaProductos) => {
        //!para no utilizar el compoenente reutilizable
        //this.tabla.datos = respuesta.producto;
        this.productos=respuesta.producto;
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

  obtenerSeleccionado(producto: Producto) {

    console.log(producto)

    //para limpiar la imagen anteriormente seleccionada
    this.limpiarArchivo();
    this.accion="M";
    this.seleccionado = {...producto};
    //se debe instanciar el formulario una vez que se establece el valor de this.seleccionado, para permitir la validacion asincrona
    this.instanciarFormularioDatos(true);
    //si es modificacion, se agrega el valor del producto una vez que se obtienen las clasificaciones
    this.obtenerClasificaciones(true); 
    this.mostrarModal(this.modProductoId, true);
  }

  instanciarFormularioDatos(esModificar:boolean){
    if(esModificar){
      this.form=this.formulario.group({//Validators.pattern(/^[a-zA-Z() ñ]+$/)
        nombre:['',//https://www.youtube.com/watch?v=J2cgd9Ii8Xk
        {
          validators:[Validators.required, Validators.minLength(3), Validators.maxLength(100)],
          asyncValidators:[Validaciones.validacionProducto(this.servicioProd, this.seleccionado.nombre)],
          updateOn:"blur"
        }],    
        precio:['',[Validators.required, Validators.min(0)]],
        descripcion:['', [Validators.maxLength(200)]],//[Validators.required, Validators.minLength(5), Validators.maxLength(200)]
        idclasificacion:['',[Validators.required]],
        facturable:['',[Validators.required]],

        //add
        idmarca:['',[Validators.required]],
        idunidad:['',[Validators.required]],
      });

    }else{
      this.form=this.formulario.group({//Validators.pattern(/^[a-zA-Z() ñ]+$/)
        nombre:['',//https://www.youtube.com/watch?v=J2cgd9Ii8Xk
            {
          validators:[Validators.required, Validators.minLength(3), Validators.maxLength(100)],
          asyncValidators:[Validaciones.validacionProducto(this.servicioProd, undefined)],
          updateOn:"blur"
        }],
        precio:['',[Validators.required, Validators.min(0)]],
        descripcion:['', [Validators.maxLength(200)]],//[Validators.required, Validators.minLength(5), Validators.maxLength(200)]
        idclasificacion:['',[Validators.required]],

        
        //add
        idmarca:['',[Validators.required]],
        idunidad:['',[Validators.required]],
      });
    }
  }


  //todo: actualizando

  // obtenerClasificaciones(esModificacion:boolean){
  //   if(esModificacion && this.seleccionado!=undefined){//solo para vonve
  //     this.cargandoComboClasif=true;
  //     this.servicioClasif.obtenerClasificaciones()
  //     .subscribe({
  //       next:(response:RespuestaClasificaciones)=>{
  //         this.clasificaciones=response.clasificacion;
  //         this.cargandoComboClasif=false;
  //         this.form.patchValue(this.seleccionado);
  //         //el precio se establece en decimal y por ahora solo es necesario que se maneje como entero
  //         this.form.get('precio')?.setValue(parseInt(this.seleccionado.precio.toString()));

  //       },
  //       error:(errores)=>{
  //         errores.forEach((error: string) => {
  //           this.mensajeAlertify.mensajeError(error);
  //         });
  //       }

  //     });
  //   }else{
  //     this.cargandoComboClasif=true;
  //     this.servicioClasif.obtenerClasificaciones()
  //     .subscribe({
  //       next:(response:RespuestaClasificaciones)=>{
  //         this.clasificaciones=response.clasificacion;
  //         this.cargandoComboClasif=false;
  //       },
  //       error:(errores)=>{
  //         errores.forEach((error: string) => {
  //           this.mensajeAlertify.mensajeError(error);
  //         });
  //       }
  //     });
  //   }
  // }

  obtenerClasificaciones(esModificacion:boolean){
    if(esModificacion && this.seleccionado!=undefined){//solo para vonve
      this.cargandoComboClasif=true;
      this.servicioProd.obtenerDatos()
      .subscribe({
        next:(response:DatosProductos)=>{
          this.clasificaciones=response.clasificaciones.clasificacion;
          this.marcas=response.marcas.marca;
          this.unidades=response.unidades.unidad;

          this.cargandoComboClasif=false;
          this.form.patchValue(this.seleccionado);
          console.log('consulta ', this.seleccionado)
          console.log(response)

          //el precio se establece en decimal y por ahora solo es necesario que se maneje como entero
          this.form.get('precio')?.setValue(parseInt(this.seleccionado.precio.toString()));

        },
        error:(errores)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        }

      });
    }else{
      this.cargandoComboClasif=true;
      this.servicioProd.obtenerDatos()
      .subscribe({
        next:(response:DatosProductos)=>{
          this.clasificaciones=response.clasificaciones.clasificacion;
          this.marcas=response.marcas.marca;
          this.unidades=response.unidades.unidad;

          this.cargandoComboClasif=false;
        },
        error:(errores)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        }
      });
    }

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
      this.servicioImagen.crear(this.seleccionado.idProducto, "productos", formularioDeDatos)
      .subscribe({
        next:(response)=>{
          
          // Llama a la función para recargar la página, pq si no se recarga la url sigue siendo la misma y el navegador sigue mostrando la misma imagen
          //si se vuelve a ver la misma imagen sin recargar          
          this.mostrarModal(this.modProductoId, false);
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


//!probando moneda
/*
import { registerLocaleData } from '@angular/common';
import localeEsPy from '@angular/common/locales/es-PY';
import { Marca } from '../../modelos/marca.model';
// Registra la configuración de localización para 'es-PY'
registerLocaleData(localeEsPy, 'es-PY');
//COPIAR EN EL COMPONENTE
// currencyPipe: CurrencyPipe = new CurrencyPipe('en-US'); // Ajusta la configuración de localización según tus necesidades
currencyPipe: CurrencyPipe = new CurrencyPipe('es-PY'); // Ajusta la configuración de localización según tus necesidades
*/