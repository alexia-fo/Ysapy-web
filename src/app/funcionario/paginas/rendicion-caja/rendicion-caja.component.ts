import { Component } from '@angular/core';
import { Dinero, RespuestaDatosDinero } from '../../modelos/inventario.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatNumber } from '@angular/common';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-rendicion-caja',
  templateUrl: './rendicion-caja.component.html',
  styleUrls: ['./rendicion-caja.component.css'],
  
})
export class RendicionCajaComponent {
  dineros: Dinero[]=[];//lista para la tabla
  invHabilitado:boolean=false;
  descripcion:string='';
  cargandoTabla:boolean = false; //obteniendo los datos a mostrar en la tabla
  
  form!: FormGroup;
  //mod1
  //form = new FormGroup({}); //formulario
  cargando!: boolean; //registro de rendicion en proceso

  dtOptions = {
    paging:false,
    info:false,
    responsive:false,
    // ordering: false, // Deshabilitar la ordenación por defecto
    order: [[1, 'asc']], // Ordenar por el segundo campo (índice 1) en forma ascendente
    
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
      dineroControles: this.fb.array([]) // FormArray para los FormGroup de cantidad y monto
    });
  }

  dineroControles!: FormArray;
  

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

/* */

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
  return valido?valido:false;
}

  //falta
  enviar(){
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    // console.log(this.form.getRawValue())
    
    // let rendicion = {dineros:this.form.value } ;
    this.cargando = true;

    this.servicioR.registrarRendicion(this.form.getRawValue()).subscribe({
    //this.servicioR.registrarRendicion(rendicion).subscribe({
    
      next: (respuesta: respuestaMensaje) => {
        this.cargando = false;
        $('#modal').modal('hide');
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        this.consultarDetalle();
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargando = false;
      },
    });

  }

  consultarDetalle(){
    this.form.reset();//para limpiar al volver a mostrar luego de guardar
    this.cargandoTabla=true;
    this.servicioR.obtenerDatosDinero()
    .subscribe({
      next:(respuesta:RespuestaDatosDinero)=>{

        this.descripcion=respuesta.descripcion;
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.dineros=respuesta.dineros!;

          this.dineroControles = this.form.get('dineroControles') as FormArray;
            this.dineros.forEach((dinero: Dinero) => {

            const group = this.fb.group({
              cantidad: [0, [Validators.required, Validators.min(0)]],
              observacion: [''],
              idBillete: [dinero.idBillete]
            });
            this.dineroControles.push(group);
        });
         
        }else{
          this.invHabilitado=false;
        }
        this.cargandoTabla = false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        
        this.cargandoTabla = false;      }
    });
  }
  //CON NG MODEL
  
  /*
  productos: Producto[]=[];//lista para listar en la tabla
  
  actualizarCantidad(producto: Producto){
    if (producto.cantidad) {
      producto.total=producto.precio*producto.cantidad;
    }

  }
  
  mostrar(){
    console.log(this.productos);
  }
  */
  
  // formatMonto(event: any) {
  //   const input = event.target;
  //   const value = input.value;
  
  //   // Remueve los separadores de miles existentes
  //   const numberValue = Number(value.replace(/,/g, ''));
  
  //   if (!isNaN(numberValue)) {
  //     // Formatea el número con separadores de miles y lo asigna nuevamente al input
  //     const formattedValue = new Intl.NumberFormat('en-US').format(numberValue);
  //     input.value = formattedValue;
  //   }
  // }
  
  
}
