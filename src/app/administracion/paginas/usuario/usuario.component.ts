import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormatosService } from 'src/app/validaciones/formatos.service';
import { EliminadoUsuario, RespuestaUsuarios, RolSucursal, Usuario } from '../../modelos/usuario.model';
import { Rol } from '../../modelos/rol.model';
import { Validaciones } from 'src/app/validaciones/bd';//por ahora no cuenta con validaciones asincronas
import { environment } from 'src/environments/environment';
import { Sucursal } from '../../modelos/sucursal.model';
import { TablaItem } from 'src/app/utilidades/modelos/modal-buscar.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { ImagenService } from 'src/app/utilidades/servicios/imagenes/imagen.service';
import { ImagenesService } from 'src/app/utilidades/imagenes.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {


  //id del modal para mostrarlo u ocultarlo mediante jquery (mediante los id's establecidos a cada modal se puede manipular más de uno en un mismo componente)
  //se puede ocultar un modal y mostrar otro y viceversa
  modUsuarioId = 'modalUsuario';
  modContrasenaId = 'modalContrasena';

  //para construir la tabla se requieren ciertos datos como las propiedades, que corresponden a los campos retornados de la BD mediante el backend;
  //los datos, corresponde al array de informacion que se quiere listar 
  //los campos son los encabezados que tendrá la tabla (las propiedades y los campos deben estar en el mismo orden)
  tabla: TablaItem<Usuario> = { //propiedades de la tabla para el listado
    propiedades: ['idUsuario', 'nombre', 'nusuario', 'correo','Sucursal.nombre','Rol.rol', 'activo', 'google'],
    datos: [],
    campos: ['Id', 'Nombre', 'Usuario', 'Correo', 'Sucursal','Rol', 'Activo', 'Google'],
  }

  //almacena el objeto de la fila (a editar o eliminar) seleccionada en la tabla 
  //se utiliza para agregar los valores al formulario - tambien se utiliza para obtener el id del producto editado a guardar
  seleccionado!: Usuario;

  //formulario para crear y modificar registros (en este caso se instancia más de una vez, se instancia cuando se va a ralizar una creacion
  //y cuando se va a hacer una modificacion, porque requiere de validaciones asincronas: cuando es una modificación se envia al validador del nombre, el nombre a modificar,
  //que no se deberia tener en cuenta al verificar si el nombre ya se encuentra almacenado en la BD)
  //para las validaciones asincronas es necesario que al instanciar el formulario ya se le envie los parametros necesarios para validarlo
  form!: FormGroup;
  //formInstanciado: boolean = false; // no es necesario pq el fomulario se instancia una sola vez pq no requiere de validaciones asincronas

  //crear-modificar-eliminar (se le envia como parametro al modal para habilitar o deshabilitar botones)
  //tambien se utiliza al momento de guardar para verificar si se insertara un nuevo registro o se actualizara uno existenete
  accion!: string;

  //para verificar si la operacion crud esta en proceso (se utiliza para habilitar o deshabilitar botones, mostrar u ocultar el loading)
  cargandoOperacion!: boolean;

  //La propiedad "cargandoTabla" evita que en el datatable haya errores si se retrasa la obtencion de datos;
  //si la tabla no utiliza el ngIf para validar que ya se cuenta con los datos, la misma igual se construye y muestra el mensaje "No hay datos 
  //disponibles en la tabla" cuando la obtencion de datos esta pendiente, luego de que se haya completado, la tabla ya no se actualiza 
  //pq el datatable solo tiene en cuenta los datos inciales(vacío al momento de construir la tabla), por esta razon
  //muestra con el paginado incorrecto y ademas el mensaje "No hay datos disponibles en la tabla" se muestra al final
  cargandoTabla = true; //obteniendo los datos a mostrar en la tabla

  dtOpciones: DataTables.Settings = {//configuracion del datatable
    paging: true,
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

  //------- ROLES DE USUARIOS ---------//

  cargandoComboRol = false; // una vez que se obtengan los roles establecer datos a editar (para loading )

  roles!: Rol[]; //para el combo de roles

  sucursales!: Sucursal[];

  //------IMAGEN DE USARIO---//
  apiUrl = `${environment.API_URL}/api/uploads/usuarios/`; //ruta del API (se usa para mostrar la imagen actual de un producto seleccinado para modificar)

  cargandoImagen: boolean = false; // si se está guardando imagen (para deshabilitar botones)

  archivos: any = [];  // imagen seleccionada (se utiliza al momento de guardar)

  previsualizacion!: string; //imagen en base 64 (para la previsualizacion de la imagen en el html)

  formImagen!: FormGroup; //formulario independiente para guardar las imagenes, sin el resto de los datos

  formContra!: FormGroup; //formulario solo para cambiar la contraseña, no incluye el resto de los datos

  botonesHabilitados = false; //una vez que se toca el campo de seleccion de imagen el boton de guardar datos se oculta (para que los botones no confundan)

  getCurrentTimestamp(): number {
    return new Date().getTime();
  }
  constructor(
    private formulario: FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioUsu: UsuarioService,
    private servicioConvImg: ImagenService,
    private servicioImagen: ImagenesService,
    private formatos: FormatosService
  ) { }

  ngOnInit(): void {

    this.instanciarFormularioDatos(false);
    this.instanciarFormularioImg();
    this.instanciarFormularioContr();

    this.obtenerUsuarios();
  }

  nuevo() {

    this.accion = "C";
    this.instanciarFormularioDatos(false);
    this.obtenerRoles(false);
    this.mostrarModal(this.modUsuarioId, true);
  }

  guardar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.formPendiente) {
      return;
    }

    this.cargandoOperacion = true;
    let { ...usuario } = this.form.value;
    //siempre va a ser de tipo E:empleado, no hace falta en el formulario
    //usuario.tipo = 'E';

    if (this.accion == 'C') {
      this.servicioUsu.crear(usuario).subscribe({
        next: (respuesta: Usuario) => {
          this.mostrarModal(this.modUsuarioId, false);
          this.cargandoOperacion = false;
          this.obtenerUsuarios();
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
      this.servicioUsu
        .actualizar(this.seleccionado.idUsuario, usuario)
        .subscribe({
          next: (respuesta: Usuario) => {
            this.mostrarModal(this.modUsuarioId, false);
            this.cargandoOperacion = false;
            this.obtenerUsuarios();
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
    this.cargandoOperacion = true;
    this.mostrarModal(this.modUsuarioId, false);
    this.mensajeAlertify.mensajeConfirmacion(`Confirma la anulacion del producto ${this.seleccionado.nombre}`, () => {
      this.servicioUsu.eliminar(this.seleccionado.idUsuario).subscribe({
        next: (respuesta: EliminadoUsuario) => {
          this.cargandoOperacion = false;
          this.obtenerUsuarios();
          this.mensajeAlertify.mensajeExito(
            `${respuesta.usuario.nombre} se ha anulado correctamente ✓✓`
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

  //faltan mensajes
  mensaje(campo: string) {
    let mensaje = "";
    if (this.form.get(campo)?.hasError('required')) {
      if (campo == "nombre") {
        mensaje = "El nombre es requerido..";
      }

      if (campo == "nusuario") {
        mensaje = "El usuario es requerido..";
      }

      if (campo == "correo") {
        mensaje = "El correo es requerido..";
      }

      if (campo == "tipo") {
        mensaje = "El tipo es requerido..";
      }

      if (campo == "idrol") {
        mensaje = "El rol es requerido..";
      }

      if (campo == "idsucursal") {
        mensaje = "La sucursal es requerida..";
      }

      if (campo == "contra") {
        mensaje = "La contraseña es requerida..";
      }

      if (campo == "contrasena2") {
        mensaje = "La confirmacion de contr. es requerida..";
      }

    }

    if (this.form.get(campo)?.hasError('minlength')) {
      if (campo == "nombre") {
        mensaje = "Nombre: min 5 caracteres";
      }
      if (campo == "nusuario") {
        mensaje = "Nombre: min 5 caracteres";
      }

      if (campo == "correo") {
        mensaje = "Correo: min 5 caracteres";
      }

      if (campo == "contra") {
        mensaje = "La contrasena requiere 8 caracteres";
      }
    }

    if (this.form.get(campo)?.hasError('maxlength')) {
      if (campo == "nombre") {
        mensaje = "Nombre: max 100 caracteres";
      }

      if (campo == "nusuario") {
        mensaje = "Nombre: max 100 caracteres";
      }

      if (campo == "correo") {
        mensaje = "Nombre: max 100 caracteres";
      }

      if (campo == "tipo") {
        mensaje = "Tipo: max 1 caracter";
      }

      if (campo == "contra") {
        mensaje = "Contraseña: max 12 caracteres";
      }
    }

    /*
    if(this.form.get(field)?.hasError('not_available')){
      mensaje="Nombre no disponible..";
    }
    */

    if (this.form.get(campo)?.hasError('not_available')) {
      mensaje = "Correo no disponible..";
    }

    if (this.form.get(campo)?.hasError('notEquals')) {
      mensaje = "La contraseñas no coinciden";
    }

    return mensaje;
  }

  datoInvalido(campo: string) {
    let valido = (this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if (valido) {
      input?.classList.add("is-invalid");
    } else if ((this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.valid) {
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    } else {
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }

    return valido;
  }

  // -- PARA RECARGAR TABLA --//
  obtenerUsuarios() {
    this.cargandoTabla = true;
    this.servicioUsu.obtenerUsuarios().subscribe({
      next: (respuesta: RespuestaUsuarios) => {
        this.tabla.datos = respuesta.usuarios;
        this.cargandoTabla = false;
        console.log(respuesta)
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoTabla = false;
      },
    });
  }

  // ------ MODAL DE FORMULARIO ------ //
  mostrarModal(id: string, mostrar: boolean) {
    if (mostrar) {
      $(`#${id}`).modal('show');
    } else {
      $(`#${id}`).modal('hide');
    }

  }

  obtenerSeleccionado(usuario: Usuario) {

    //this.limpiarContrasenia();
    this.limpiarArchivo();
    this.accion = 'M';
    this.seleccionado = { ...usuario };
    console.log('seleccionado: ', usuario);

    this.instanciarFormularioDatos(true);
    this.obtenerRoles(true);
    this.mostrarModal(this.modUsuarioId, true);
  }

  instanciarFormularioDatos(esModificar: boolean) {
    if (esModificar) {//,Validators.pattern(/^[a-zA-Z() ñ]+$/)
      this.form = this.formulario.group({
        nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        nusuario: [''],
        correo: ["",
          {
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
            asyncValidators: [Validaciones.validacionCorreo(this.servicioUsu, this.seleccionado.correo)],
            updateOn: "blur"
          }],
        //tipo:['',[Validators.required,Validators.maxLength(1)]],
        idrol: ['', [Validators.required]],
        idsucursal: ['', [Validators.required]],
        turno: ['M', Validators.required],
        //LA CONTRASENA SE ACTUALIZARA INDEPENDIENTEMENTE DE LOS DATOS
      });
    } else {
      this.form = this.formulario.group({
        nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        nusuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        correo: ['',
          {
            validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100), this.formatos.esCorreoInvalido],
            asyncValidators: [Validaciones.validacionCorreo(this.servicioUsu, undefined)],
            updateOn: "blur"
          }],
        //tipo:['',[Validators.required,Validators.maxLength(1)]],
        idrol: ['', [Validators.required]],
        idsucursal: ['', [Validators.required]],
        turno: ['M', Validators.required],
        contra: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],//invenstigar a cuantos caracteres equivale en jwt
        contrasena2: ['', [Validators.required]]
      }, {
        validators: [this.formatos.camposIguales('contra', 'contrasena2')]
      });
    }
  }

  // -------- imagen -----------------// 

  capturarArchivo(event: any) {

    if (event.target.files[0]) {
      const archivoCapturado = event.target.files[0];
      this.servicioConvImg.extraerBase64(archivoCapturado).then((imagen: any) => {
        this.previsualizacion = imagen.base;
      })
      this.archivos.push(archivoCapturado);

      this.botonesHabilitados = false;
    } else {
      this.botonesHabilitados = true;
    }

  }

  subirArchivo() {

    if (!this.formImagen.valid) {
      this.formImagen.markAllAsTouched();
      return;
    }

    try {
      this.cargandoImagen = true;
      const formularioDeDatos = new FormData();
      this.archivos.forEach((archivo: any) => {
        formularioDeDatos.append('archivo', archivo);
      });
      this.servicioImagen.crear(this.seleccionado.idUsuario, "usuarios", formularioDeDatos)
        .subscribe({
          next: (response) => {
            this.cargandoImagen = false;
            this.limpiarArchivo();
          },
          error: (errores: any) => {
            errores.forEach((error: string) => {
              this.mensajeAlertify.mensajeError(error);
            });
            console.log(errores);
            this.cargandoImagen = false;
          }
        })
    } catch (errores: any) {
      this.mensajeAlertify.mensajeError('Error en el front al guardar la imagen');
      this.cargandoImagen = false;
    }

  }

  limpiarArchivo() {
    this.formImagen.reset();
    this.archivos = []
    this.previsualizacion = '';
    this.cargandoImagen=false;
  }

  mensajeArchivo(campo: string) {
    let mensaje = "";
    if (this.formImagen.get(campo)?.hasError('required')) {
      if (campo == "imagenControl") {
        mensaje = "La imagen es requerida..";
      }
    }

    if (this.formImagen.get(campo)?.hasError('formatoInvalido')) {
      if (campo == "imagenControl") {
        mensaje = "Los formatos validos son: png, jpg, jpeg, gif";
      }

    }
    return mensaje;
  }

  archivoInvalido(campo: string) {
    return (this.formImagen.get(campo)?.touched || this.formImagen.get(campo)?.dirty) && this.formImagen.get(campo)?.invalid;
  }

  instanciarFormularioImg() {
    this.formImagen = this.formulario.group({
      imagenControl: ['', [Validators.required, this.formatos.validarFormatoImagen]]
    });
  }


  //------------MOSTRAR MODAL PARA CAMBIAR CONTRASENIA -----//
  contrasena() {
    /*
    this.formContra=this.formulario.group({
      contrasenaActual:['',[Validators.required, Validators.minLength(8), Validators.maxLength(12)]],//invenstigar a cuantos caracteres equivale en jwt
      contrasenaNueva:['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      contrasenaConfirm:['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    })
    */
    this.limpiarContrasenia();
    this.mostrarModal(this.modUsuarioId, false);
    this.mostrarModal(this.modContrasenaId, true);
  }

  limpiarContrasenia() {
    this.formContra.reset();
  }

  actualizarContra() {

    let contrasena=this.formContra.get('contrasenaNueva')?.value;
    this.cargandoOperacion=true;

    this.servicioUsu.cambiarContrasena(this.seleccionado.idUsuario,contrasena).subscribe({
      next: (respuesta: Usuario) => {
        console.log('respuesta', respuesta)
        this.mostrarModal(this.modContrasenaId, false);
        this.cargandoOperacion = false;
        this.obtenerUsuarios();
        this.mensajeAlertify.mensajeExito(
          `La contraseña de ${respuesta.nombre} se ha modificado correctamente ✓✓`
        );
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoOperacion = false;
      },
    });
  }

  mensajeContrasena(campo: string) {
    let mens = "";
    if (this.formContra.get(campo)?.hasError('required')) {
      /*if (campo == "contrasenaActual") {
        mens = "La contraseña actual es requerida..";
      }
      */
      if (campo == "contrasenaNueva") {
        mens = "La nueva contraseña es requerida..";
      }

      if (campo == "contrasenaConfirm") {
        mens = "Debe confirmar la contraseña..";
      }
    }

    if (this.formContra.get(campo)?.hasError('minlength')) {
      if (campo == "contrasenaNueva") {
        mens = "Caracteres mínimo: 8";
        console.log("Minimo")
      }

    }

    if (this.formContra.get(campo)?.hasError('maxlength')) {
      if (campo == "contrasenaNueva") {
        console.log("Maximo")
        mens = "Caracteres máximo: 12";
      }
    }


    if (this.formContra.get(campo)?.hasError('notEquals')) {
      if (campo == "contrasenaConfirm") {
        mens = "La contraseñas no coinciden";
      }
    }
    return mens;
  }
/*
  contrasenaInvalida(campo: string) {
    return (this.formContra.get(campo)?.touched || this.formContra.get(campo)?.dirty) && this.formContra.get(campo)?.invalid;
  }
*/
contrasenaInvalida(campo: string) {
    let valido = (this.formContra.get(campo)?.touched || this.formContra.get(campo)?.dirty) && this.formContra.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if (valido) {
      input?.classList.add("is-invalid");
    } else if ((this.formContra.get(campo)?.touched || this.formContra.get(campo)?.dirty) && this.formContra.get(campo)?.valid) {
      input?.classList.remove("is-invalid");
      input?.classList.add("is-valid");
    } else {
      input?.classList.remove("is-invalid");
      input?.classList.remove("is-valid");
    }

    return valido;
  }

  instanciarFormularioContr() {
    this.formContra = this.formulario.group(
      {
        //contrasenaActual: ['', [Validators.required]],//invenstigar a cuantos caracteres equivale en jwt
        contrasenaNueva: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
        contrasenaConfirm: ['', [Validators.required]]
      }
      , {
        validators: [this.formatos.camposIguales('contrasenaNueva', 'contrasenaConfirm')]
      }
    );
  }




  obtenerRoles(esModificacion: boolean) {
    /*
    if(esModificacion && this.seleccionado!=undefined){
      this.cargandoComboRol=true;
      
      this.servicioRol.obtenerRoles()
      .subscribe({
        next:(response: RespuestaRoles)=>{
          this.roles=response.rol;
          this.cargandoComboRol=false;

          this.form.patchValue(this.seleccionado);
        },
        error:(errores)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          console.log(errores);
        }
      })
    }else{
      this.cargandoComboRol=true;
      this.servicioRol.obtenerRoles()
      .subscribe({
        next:(response:RespuestaRoles)=>{
          this.roles=response.rol;
          this.cargandoComboRol=false;
        },
        error:(errores)=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          console.log(errores);
        }
      });
    }

    */

    this.cargandoComboRol = true;
    if (esModificacion && this.seleccionado != undefined) {
     

      this.servicioUsu.obtenerRolesYSucursales()
        .subscribe({
          next: (response: RolSucursal) => {
            this.roles = response.roles;
            this.sucursales = response.sucursales;

            this.cargandoComboRol = false;

            this.form.patchValue(this.seleccionado);
          },
          error: (errores) => {
            errores.forEach((error: string) => {
              this.mensajeAlertify.mensajeError(error);
            });
            console.log(errores);
          }
        })
    } else {
      this.servicioUsu.obtenerRolesYSucursales()
        .subscribe({
          next: (response: any) => {
            this.roles = response.roles;
            this.sucursales = response.sucursales;

            this.cargandoComboRol = false;
          },
          error: (errores) => {
            errores.forEach((error: string) => {
              this.mensajeAlertify.mensajeError(error);
            });
            console.log(errores);
          }
        })
    }

  }

  get formPendiente() {
    const nombreControl = this.form.get('nombre');
    return (this.form.pending && nombreControl!.touched);
  }
}