import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RespuestaDatosCab, guardarCabecera } from '../../modelos/inv-rend.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-inv-rend-cabecera',
  templateUrl: './inv-rend-cabecera.component.html',
  styleUrls: ['./inv-rend-cabecera.component.css'],
})
export class InvRendCabeceraComponent implements OnInit {
  form!: FormGroup; //para enviar la descripcion

  cargandoOperacion: boolean=false; //registrando-loading

  cargandoDatos:boolean=true; //al comenzar ya se busca la sucursal y la habilitacion del inventario, obteniendoHabilitacion-loading

  datosCabecera:RespuestaDatosCab={ 
    mostrar:false,
    descripcion:''
    //sucursal es opcional
  };

  constructor(
    private formulario: FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioI:InvRendService
  ) {}

  ngOnInit(): void {
    
    this.form = this.formulario.group({
      nombreSucursal: [''],
      observacion: ['' ],
    });

    this.form.get('nombreSucursal')?.disable();//solo mostramos el nombre de la sucursal, no editable

    this.consultarApertura();
  }

  guardar() {
    /* TODO: Si el formulario cuenta con validaciones se mostrarán los errores, en este caso no contiene validaciones */
    // if (!this.form.valid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    this.cargandoOperacion = true;
    let { ...cabecera }:guardarCabecera = this.form.value;

    this.servicioI.crearApertura(cabecera).subscribe({
      next: (respuesta: respuestaMensaje) => {

        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );

        //para volver a verificar la habilitacion de la cabecera
        this.consultarApertura();
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoOperacion = false;
      },
    });
  }

  /*FIXME:
    Constulta la habilitacion de la Cabecera (si aun no existe una cabecera en la sucursal del usuario, en el turno del usuario, en la fecha de hoy)
    si esta habilitado, se cuenta con la sucursal del usuario
  */
  consultarApertura(){
    this.cargandoDatos=true;
    this.servicioI.obtenerDatosCabecera()
    .subscribe({
      next:(respuesta:RespuestaDatosCab)=>{
        console.log(respuesta)
        this.datosCabecera=respuesta;
        if(this.datosCabecera.mostrar){
          this.form.get('nombreSucursal')?.setValue(respuesta.sucursal?.nombre);
        }
        this.cargandoDatos=false;
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos = false;
      },
    })
  }
}
