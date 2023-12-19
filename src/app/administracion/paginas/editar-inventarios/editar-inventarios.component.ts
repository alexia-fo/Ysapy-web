import { Component } from '@angular/core';
import { DatosDetalleInventario, RespuestaDetalleInventario } from '../../modelos/inventariosRegistrados';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-editar-inventarios',
  templateUrl: './editar-inventarios.component.html',
  styleUrls: ['./editar-inventarios.component.css']
})
export class EditarInventariosComponent {
//id de cabecera de inventario
idCabecera!:number;

detalleRendicion!:DatosDetalleInventario[];//para la tabla

cargandoDetalle=true; //obteniendo los datos

//////

modalEditarCantidad='modalCantidad';
modalEditarCantidades='modalCantidades';
modalEditarPrecio='modalPrecio';


form:FormGroup=new FormGroup({});//para editar un dato a la vez
productoSeleccionado!:DatosDetalleInventario;

///si se quiere modificar varios datos a la vez para saber que campos se va a modificar -- cantidadApertura y/o cierre
cantidadApertura: boolean = false;
cantidadCierre: boolean = false;

//para editar todas las cantidades a la vez
formCantidades!:FormGroup; //formulario para ingresar cantidades de productos
productosControles!: FormArray;

habilitarFormulario=false;

//para editar precio
formPrecio!:FormGroup; //formulario para ingresar cantidades de productos
constructor(
  private mensajeAlertify: AlertifyService,
  private servicioC: InventariosRegistradosService,
  private route: ActivatedRoute,
  private router: Router,
  private formulario: FormBuilder,

){
}

ngOnInit(): void {
  this.formCantidades = this.formulario.group({
    productosControles: this.formulario.array([])
  });

  this.form= this.formulario.group({
    cantidadApertura: [0, [Validators.required, Validators.min(0)]],
    cantidadCierre: [0, [Validators.required, Validators.min(0)]],
  });

  
  this.formPrecio= this.formulario.group({
    nuevoPrecio: [0, [Validators.required, Validators.min(0)]],
  });

  this.consultarDetalle();


}

consultarDetalle(){
  this.cargandoDetalle=true;
  this.route.params // obtenemos el id de la cabecera desde la url
  .pipe(
    switchMap(params => {
      this.idCabecera = params['idCabecera'];
      return this.servicioC.obtenerDetalleInventario(this.idCabecera); // una vez que obtenemos el id se realiza la consulta
    })
  )
  .subscribe({
    next: (respuesta: RespuestaDetalleInventario) => {
      // console.log('ngOnInit ', respuesta)
      this.detalleRendicion=respuesta.detalleInventario;
      this.cargandoDetalle=false;
      this.instanciarFormularioCantidades()

     },
    error: (errores) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      this.cargandoDetalle=false;
    },
  });
}

seleccionar(producto:DatosDetalleInventario){
  // console.log('seleccionado ', idProducto)
  this.productoSeleccionado=producto;
  
  // console.log("seleccionado ", this.productoSeleccionado)
  // console.log("producto ", producto)
  
  this.form.get('cantidadApertura')?.setValue(this.productoSeleccionado.cantidadApertura);
  this.form.get('cantidadCierre')?.setValue(this.productoSeleccionado.cantidadCierre);
  this.mostrarModal(this.modalEditarCantidad, true);

}


mostrarModal(id: string, mostrar:boolean) {
  if(mostrar){
    $(`#${id}`).modal('show');
  }else{
    $(`#${id}`).modal('hide');
  }
}

datosInvalidos(campo: string, formArrayName: string, index: number): boolean {
  // console.log('ejecutando datos invalidos')
  const control = this.formCantidades.get(formArrayName)?.get(`${index}.${campo}`);
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
  console.log('ejecutando mensaje de validacion ', mensaje)
  return mensaje;
}

mensaje(campo: string) {
  let mensaje = "";
  if (this.form.get(campo)?.hasError('required')) {
    if (campo == "cantidadApertura") {
      mensaje = "La cantidad de apertura es requerida..";
    }

    if (campo == "cantidadCierre") {
      mensaje = "La cantidad de cierre es requerida..";
    }

  }
  if (this.form.get(campo)?.hasError('min')) {
    if (campo == "cantidadApertura") {
      mensaje = "La cantidad de apertura minima es 0..";
    }

    if (campo == "cantidadCierre") {
      mensaje = "La cantidad de cierre minima es 0..";
    }

  }
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


confirmarOperacionEnvio(){
  //prueba
  this.mostrarModal(this.modalEditarCantidad, false)
  this.mostrarModal('modMensajeId',true)
}

enviar(){
  console.log('desea actualizar los datos ', this.form.value)

  this.servicioC.editarCantidadProducto(this.idCabecera, this.productoSeleccionado.idproducto, this.form.value).subscribe({
    next: (respuesta: respuestaMensaje) => {
      this.mostrarModal('modMensajeId', false);

      this.mensajeAlertify.mensajeExito(
        `${respuesta.msg}`
      );
    },
    error: (errores: string[]) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      console.log(errores);
      
    },
  });
}

verProductoModificar(){
  this.mostrarModal(this.modalEditarCantidades, true);
}
  
instanciarFormularioCantidades(){
  // this.mostrarModal(this.modalEditarCantidades, true);

  this.productosControles = this.formCantidades.get('productosControles') as FormArray;

  this.detalleRendicion.forEach((producto:DatosDetalleInventario) => {
    // const controlName = dinero.idBillete.toString();
    /*FIXME:
    Se verifica cada formGroup del formulario para ver si contiene un controlador que tiene como nombre el idBillete
    si es que existe se obtiene el formGroup en existingControl y se limpia,
    si es que no se crean los controladores
    */
    const existingControl = this.productosControles.controls.find((control: AbstractControl) => {
      return (control as FormGroup).get('idProducto')?.value === producto.idproducto;
    });

    if (existingControl instanceof FormGroup) {
      
      existingControl.get('cantidadApertura')?.setValue(producto.cantidadApertura);// Establece el valor a 0
      existingControl.get('cantidadCierre')?.setValue(producto.cantidadCierre);// Establece el valor a 0
      existingControl.markAsUntouched(); // Marca como no tocado
      existingControl.markAsPristine(); // Marca como no modificado
      existingControl.updateValueAndValidity(); // Actualiza la validez
    } else {
      const group = this.formulario.group({
        cantidadApertura: [producto.cantidadApertura, [Validators.required, Validators.min(0)]],
        cantidadCierre: [producto.cantidadCierre, [Validators.required, Validators.min(0)]],
        idProducto: [producto.idproducto],
      });
      // Agrega un nuevo array de controladores si no existe un controlador con el nombre idBillete

      this.productosControles.push(group);
      
    }
  });

}

enviarCantidades(){
  console.log(this.formCantidades.value)
  this.servicioC.editarCantidadesProductos(this.idCabecera, this.formCantidades.value).subscribe({
    next: (respuesta: respuestaMensaje) => {
      this.mostrarModal('modMensajeId', false);

      this.mensajeAlertify.mensajeExito(
      `${respuesta.msg}`
      );
    },
    error: (errores: string[]) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      console.log(errores);
      
    },
  });
}

visualizarFormularioPrecio(producto:DatosDetalleInventario){
  this.productoSeleccionado=producto;
  this.formPrecio.get('nuevoPrecio')?.setValue( Math.floor(producto.precio));
  this.mostrarModal(this.modalEditarPrecio, true);
}

gurdarNuevoPrecio(){
  console.log('Nuevo Precio, ', this.formPrecio.value)
  this.servicioC.editarPrecioProducto(this.idCabecera, this.productoSeleccionado.idproducto,this.formPrecio.value).subscribe({
    next: (respuesta: respuestaMensaje) => {
      this.mostrarModal('modMensajeId', false);

      this.mensajeAlertify.mensajeExito(
      `${respuesta.msg}`
      );
    },
    error: (errores: string[]) => {
      errores.forEach((error: string) => {
        this.mensajeAlertify.mensajeError(error);
      });
      console.log(errores);
      
    },
  });

}

}
