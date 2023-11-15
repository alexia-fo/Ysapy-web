import { Component } from '@angular/core';
import { Dinero, GuardarRendicion, RespuestaDatosDinero } from '../../modelos/inv-rend.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-rendicion-caja',
  templateUrl: './rendicion-caja.component.html',
  styleUrls: ['./rendicion-caja.component.css'],

})
export class RendicionCajaComponent {
  dineros: Dinero[] = [];//lista para la tabla
  cargandoTabla: boolean = false; //obteniendo los datos a mostrar en la tabla

  invHabilitado: boolean = false;
  descripcion: string = '';
  fechaApertura:Date | undefined;
  idCabeceraInv:number  | undefined;

  form!: FormGroup;//formulario para ingresar cantidades de productos y observaciones
  cargandoOperacion!: boolean; //registro de rendicion en proceso
  dineroControles!: FormArray;

  dtOptions = {
    paging: false,
    info: false,
    responsive: true,
    searching: false,
    ordering: false, // Deshabilitar el ordenamiento por defecto
    // order: [[1, 'asc']], // Ordenar por el segundo campo (índice 1) en forma ascendente

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
    private servicioR: InvRendService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      dineroControles: this.fb.array([]) // FormArray para los FormGroup de cantidad y observacion
    });
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  /*
    "control" seria el formArray especifico en el cual se buscara el controlador con nombre "campo"
    el cual se verificará si cuenta con errores, para devolver los mensajes de error si son necesario
  */
  mensajeValidacion(campo: string, control: AbstractControl): string {
    let mensaje = '';
    if (control.get(campo)?.invalid && (control.get(campo)?.touched || control.get(campo)?.dirty)) {
      if (control.get(campo)?.errors?.['required']) {
        mensaje = 'Es requerido';
      }
      if (control.get(campo)?.errors?.['min']) {
        mensaje = 'Mínimo 0';
      }
    }
    return mensaje;
  }

  /*FIXME:
    datoInvalido(campo: string, formArrayName: string, index: number): boolean {: Esta función toma tres parámetros:
  
    campo: El nombre del campo que se desea validar dentro de un elemento de dinero.
    formArrayName: El nombre del formArray que contiene los elementos de dinero.
    index: El índice del elemento de dinero dentro del formArray que se está validando.
    const control = this.form.get(formArrayName)?.get(${index}.${campo});: En esta línea, se obtiene una referencia al control específico del campo dentro del formulario. Se utiliza this.form.get(formArrayName) para acceder al formArray y luego get(${index}.${campo}) para acceder al control del campo dentro del elemento de dinero específico.
  
    const valido = (control?.touched || control?.dirty) && control?.invalid;: Se verifica si el campo es válido o no utilizando tres condiciones:
  
    control?.touched || control?.dirty: Verifica si el campo ha sido tocado (interactuado por el usuario) o si ha sido modificado (dirty). Esto indica que el campo ha tenido alguna interacción.
    control?.invalid: Verifica si el campo tiene un estado de "inválido" según las reglas de validación definidas en el formulario.
    const input = document.getElementById(${formArrayName}-${index}-${campo});: Se obtiene una referencia al elemento del DOM correspondiente al campo del formulario utilizando un id que sigue una convención específica. Este id se forma concatenando los valores de formArrayName, index y campo.
  
    if (valido) { ... }: Si la variable valido es true, significa que el campo es inválido según las condiciones establecidas. En este caso:
  
    Se agrega la clase "is-invalid" al elemento del DOM asociado al campo. Esto es tilizado en CSS para aplicar estilos visuales que indiquen que el campo es inválido.
    else if ((control?.touched || control?.dirty) && control?.valid) { ... }: Si el campo no es inválido, pero ha sido tocado o modificado por el usuario y es válido, se realiza lo siguiente:
  
    Se quita la clase "is-invalid" del elemento del DOM asociado al campo (si estaba presente).
    Se agrega la clase "is-valid" al elemento del DOM asociado al campo. Esto es utilizado en CSS para aplicar estilos visuales que indiquen que el campo es válido.
    else { ... }: Si ninguna de las condiciones anteriores se cumple, se ejecuta este bloque:
  
    Se quita la clase "is-invalid" del elemento del DOM asociado al campo (si estaba presente).
    Se quita la clase "is-valid" del elemento del DOM asociado al campo (si estaba presente).
    return valido ? valido : false;: La función devuelve el valor de valido (que es un valor booleano que indica si el campo es inválido según las condiciones de validación) como resultado. Si valido es true, se devuelve true, y si es false, se devuelve false.
  */
  datoInvalido(campo: string, formArrayName: string, index: number): boolean {
    const control = this.form.get(formArrayName)?.get(`${index}.${campo}`);
    const valido = (control?.touched || control?.dirty) && control?.invalid;
    const input = document.getElementById(`${formArrayName}-${index}-${campo}`);
    if (valido) {
      input?.classList.add('is-invalid');
    } else if ((control?.touched || control?.dirty) && control?.valid) {
      input?.classList.remove('is-invalid');
      input?.classList.add('is-valid');
    } else {
      input?.classList.remove('is-invalid');
      input?.classList.remove('is-valid');
    }
    return valido ? valido : false;
  }

  enviar() {
    //Para mostrar error en las cantidades no establecidas de los billetes 
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.mensajeAlertify.mensajeConfirmacion('Desea guardar el inventario',()=>{//todo:add


    this.cargandoOperacion = true;
    let rendicion: GuardarRendicion = this.form.getRawValue();

    this.servicioR.registrarRendicion(rendicion).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        //Luego de la apertura de caja; en caso de que el inventario de productos ya se haya registrado se mostrara el cierre de inventario con
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

  })//todo:add


  }

  /*FIXME:en caso que se cargue la pagina se crean los controladores
  en caso de de que se recargue la tabla se limpian los controladores existentes*/
  consultarDetalle() {
    this.cargandoTabla = true;
    this.servicioR.obtenerDatosDinero()
      .subscribe({
        next: (respuesta: RespuestaDatosDinero) => {

          this.descripcion = respuesta.descripcion;
          this.fechaApertura=respuesta.fechaApertura;
          this.idCabeceraInv=respuesta.idCabeceraInv;

          if (respuesta.mostrar) {
            this.invHabilitado = true;
            this.dineros = respuesta.dineros!;
            console.log(respuesta.dineros)

            this.dineroControles = this.form.get('dineroControles') as FormArray;

            this.dineros.forEach((dinero: Dinero) => {
              // const controlName = dinero.idBillete.toString();
              /*FIXME:
              Se verifica cada formGroup del formulario para ver si contiene un controlador que tiene como nombre el idBillete
              si es que existe se obtiene el formGroup en existingControl y se limpia,
              si es que no se crean los controladores
              */
              const existingControl = this.dineroControles.controls.find((control: AbstractControl) => {
                return (control as FormGroup).get('idBillete')?.value === dinero.idBillete;
              });

              if (existingControl instanceof FormGroup) {
                // existingControl.reset();

                existingControl.get('cantidad')?.setValue(0);// Establece el valor a 0
                existingControl.get('observacion')?.setValue('');
               // existingControl.get('monto')?.setValue('');//TODO: prueba total caja
                existingControl.markAsUntouched(); // Marca como no tocado
                existingControl.markAsPristine(); // Marca como no modificado
                existingControl.updateValueAndValidity(); // Actualiza la validez
              } else {
                const group = this.fb.group({
                  
                  monto:[dinero.monto],//TODO: prueba total caja
                  cantidad: [0, [Validators.required, Validators.min(0)]],
                  observacion: [''],
                  idBillete: [dinero.idBillete],
                  //para calcular el total de dinero que son de tipo entrada
                  entrada:[dinero.entrada]
                });
                // Agrega un nuevo array de controladores si no existe un controlador con el nombre idBillete

                this.dineroControles.push(group);
              }
            });

          } else {
            this.invHabilitado = false;
          }
          this.cargandoTabla = false;
        },
        error: (errores) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });

          this.cargandoTabla = false;
        }
      });
  }

  calcularTotalCaja():number{

    let total=0;
    let cantidad=0;
    let monto=0;
    let entrada=0;
    this.dineroControles = this.form.get('dineroControles') as FormArray;

    this.dineroControles.controls.forEach(i =>{
      // console.log(i.get('cantidad')?.value)
      cantidad=i.get('cantidad')?.value;
      monto=i.get('monto')?.value;
      entrada=i.get('entrada')?.value;
      /*1: dinero existente cobrado por venta de productos, 0: dinero no presente pq aun 
      no se ha cobrado por la venta o se ha cobrado con tarjeta, 2: dinero cobrado no por 
      venta actual de productos ej cobro por creditos anteriores, 3: se ha pagado por alguna 
      compra con el dinero cobrado */
      if(entrada!=3){
        total+=cantidad*monto;
      }
    })

    return total;
  }

}
