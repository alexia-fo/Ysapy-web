import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SucursalService } from '../../servicios/sucursal.service';
import { EliminadoSucursal, RespuestaSucursales, Sucursal } from '../../modelos/sucursal.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
@Component({
  selector: 'app-abmc-sucursal',
  templateUrl: './abmc-sucursal.component.html',
  styleUrls: ['./abmc-sucursal.component.css']
})
export class AbmcSucursalComponent /*implements AfterViewInit*/{

  //id del modal para mostrarlo u ocultarlo mediante jquery (mediante los id's establecidos a cada modal se puede manipular más de uno en un mismo componente)
  //se puede ocultar un modal y mostrar otro y viceversa
  modSucursalId='modalSucursal';

  //listado de sucursales que se van a mostrar en la tabla
  tabla:Sucursal[]=[];

  //almacena el objeto de la fila (a editar o eliminar) seleccionada en la tabla 
  //se utiliza para agregar los valores al formulario - tambien se utiliza para obtener el id del producto editado a guardar
  seleccionado!: Sucursal; 

  //formulario para crear y modificar registros (en este caso se instancia más de una vez, se instancia cuando se va a ralizar una creacion
  //y cuando se va a hacer una modificacion, porque requiere de validaciones asincronas: cuando es una modificación se envia al validador del nombre, el nombre a modificar,
  //que no se deberia tener en cuenta al verificar si el nombre ya se encuentra almacenado en la BD)
  //para las validaciones asincronas es necesario que al instanciar el formulario ya se le envie los parametros necesarios para validarlo
  form!: FormGroup; 
  //formInstanciado: boolean = false; // no es necesario pq el fomulario se instancia una sola vez pq no requiere de validaciones asincronas

  // se utiliza al momento de guardar para verificar si se insertara un nuevo registro o se actualizara uno existenete
  accion!: 'C' | 'M' | 'E'; 

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
    //desactivar la responsividad del datatable
    responsive:false,
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

  
  constructor(
    private formulario: FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioSucur: SucursalService,
  ) {}

  ngOnInit(): void {
    //el formulario solo se instancia una vez, para las acciones crear y modificar solo se modifica
    this.instanciarFormulario();
    //las sucusales solo se obtinen una vez al inicializar el componente
    this.obtenerSucursales();
  }

  nuevo() {
    this.accion = 'C';
    this.limpiarFormulario();
    this.mostrarModal(this.modSucursalId, true);
  }

  guardar() {
    if (!this.form.valid) {
      //los mensajes de error se visualizaran al marcar los input como tocados
      this.form.markAllAsTouched();
      return;
    }

    this.cargandoOperacion = true; //empieza la operacion de registro
    let { ...sucursal } = this.form.value;

    if (this.accion == 'C') {
      this.servicioSucur.crear(sucursal).subscribe({
        next: (respuesta: Sucursal) => {
          this.mostrarModal(this.modSucursalId, false);
          this.cargandoOperacion=false;
          this.obtenerSucursales();
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
      this.servicioSucur
        .actualizar(this.seleccionado.idSucursal, sucursal)
        .subscribe({
          next: (respuesta: Sucursal) => {
            this.mostrarModal(this.modSucursalId, false);
            this.cargandoOperacion=false;
            this.obtenerSucursales();
            $('#modal').modal('hide');
            this.mensajeAlertify.mensajeExito(
              `${respuesta.nombre} se ha actualizado correctamente ✓✓`
            );
          },
          error: (errores) => {
            errores.forEach((error: string) => {
              this.mensajeAlertify.mensajeError(error);
            });
            console.log(errores);
            this.cargandoOperacion = false;
          },
        });
    }
  }

  eliminar() {
    this.cargandoOperacion=true;
    this.mostrarModal(this.modSucursalId, false);
    this.mensajeAlertify.mensajeConfirmacion(`Confirma la anulacion de la sucursal ${this.seleccionado.nombre}`,() => {
      this.servicioSucur
        .eliminar(this.seleccionado.idSucursal)
        .subscribe({
          next: (respuesta: EliminadoSucursal) => {
            this.cargandoOperacion=false;
            this.obtenerSucursales();
            this.mensajeAlertify.mensajeExito(
              `${respuesta.sucursal.nombre} se ha anulado correctamente ✓✓`
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
    );
  }

  mensaje(field: string) {
    let mensaje = '';
    if (this.form.get(field)?.hasError('required')) {
      if (field == 'nombre') {
        mensaje = 'El nombre es requerido..';
      }
    }

    if (this.form.get(field)?.hasError('minlength')) {
      if (field == 'nombre') {
        mensaje = 'Nombre: min 5 caracteres';
      }
    }

    if (this.form.get(field)?.hasError('maxlength')) {
      if (field == 'nombre') {
        mensaje = 'Nombre: max 100 caracteres';
      }
    }
    
    return mensaje;
  }

  //para agregar clases que marquen los inputs validos y no validos
  datoInvalido(campo: string) {
    let valido = (this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.invalid;
    let input = document.getElementById(campo);
    if (valido) {
      input?.classList.add('is-invalid');
    } else if ((this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.valid) {
      input?.classList.remove('is-invalid');
      input?.classList.add('is-valid');
    } else {
      input?.classList.remove('is-invalid');
      input?.classList.remove('is-valid');
    }
    return valido;
  }

  // -- PARA RECARGAR TABLA --//
  obtenerSucursales() {
    this.cargandoTabla=true;
    this.servicioSucur.obtenerSucursales().subscribe({
      next: (respuesta: RespuestaSucursales) => {
        this.tabla = respuesta.sucursal;
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

  // ----------- MODAL DE FORMULARIO ---------- //
  mostrarModal(id: string, mostrar:boolean) {
    if(mostrar){
      $(`#${id}`).modal('show');
    }else{
      $(`#${id}`).modal('hide');
    }
  }

  obtenerSeleccionado($event: Sucursal){
    this.limpiarFormulario();
    this.accion='M';
    this.mostrarModal(this.modSucursalId, true);
    this.seleccionado = { ...$event };
    this.form.patchValue($event);
  }

  instanciarFormulario(){
    this.form = this.formulario.group({
      nombre: ['', Validators.required],
    });
  }

  limpiarFormulario(){
    this.form.reset();
  }

}
