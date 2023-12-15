import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-registro-megas',
  templateUrl: './registro-megas.component.html',
  styleUrls: ['./registro-megas.component.css']
})
export class RegistroMegasComponent implements OnInit{
  form!: FormGroup; 
  cargandoOperacion=true;

  constructor(
    private formulario: FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioI: InvRendService
  ) {}

  ngOnInit(): void {
    this.form = this.formulario.group({
      megas: ['', [Validators.required]],
    });
  }

  guardar() {
    if (!this.form.valid) {
      //los mensajes de error se visualizaran al marcar los input como tocados
      this.form.markAllAsTouched();
      return;
    }

    
    this.cargandoOperacion = true; //empieza la operacion de registro
    let { ...datos } = this.form.value;
    console.log(datos)

      this.servicioI.controlMegas(datos).subscribe({
        next: (respuesta:respuestaMensaje) => {
          this.cargandoOperacion=false;
          this.mensajeAlertify.mensajeExito(
           respuesta.msg
          );
        },
        error: (errores: string[]) => {
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
          console.log(errores);
          this.cargandoOperacion = false;
        },
      });

      this.form.reset();

  }


  mensaje(field: string) {
    let mensaje = '';
    if (this.form.get(field)?.hasError('required')) {
      if (field == 'megas') {
        mensaje = 'La cantidad de megas es requerida..';
      }
    }
    
    return mensaje;
  }

  datoInvalido(campo: string) {
    let valido =(this.form.get(campo)?.touched || this.form.get(campo)?.dirty) && this.form.get(campo)?.invalid;
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
}
