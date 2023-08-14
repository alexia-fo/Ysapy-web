import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormatosService } from 'src/app/validaciones/formatos.service';
import { RespuestaDatosCab } from '../../modelos/inventario.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';

@Component({
  selector: 'app-inv-rend-cabecera',
  templateUrl: './inv-rend-cabecera.component.html',
  styleUrls: ['./inv-rend-cabecera.component.css'],
})
export class InvRendCabeceraComponent implements OnInit {
  form!: FormGroup; //formulario para los datos, sin las imágenes

  cargandoOperacion: boolean=false; //registrando-loading

  cargandoDatos:boolean=true; //al comenzar ya se busca la sucursal

  datosCabecera:RespuestaDatosCab={
    mostrar:false,
    descripcion:''
  };

  constructor(
    private formulario: FormBuilder,
    private mensajeAlertify: AlertifyService,
    private formatos: FormatosService,
    private servicioI:InvRendService
  ) {}

  ngOnInit(): void {
    
    this.form = this.formulario.group({
      nombreSucursal: [''],
      observacion: ['' ],
    });

    this.form.get('nombreSucursal')?.disable();//solo mostramos el nombre de la sucursal

    this.consultarApertura();
  }

  guardar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargandoOperacion = true;
    let { ...cabecera } = this.form.value;

    this.servicioI.crearApertura(cabecera).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );

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

  consultarApertura(){
    this.cargandoDatos=true;
    this.servicioI.obtenerDatosCabecera()
    .subscribe({
      next:(respuesta:RespuestaDatosCab)=>{
        //console.log(respuesta)
        this.datosCabecera=respuesta;
        if(respuesta.mostrar){
          this.form.get('nombreSucursal')?.setValue(respuesta.sucursal?.nombre);
        }
        this.cargandoDatos=false;
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        console.log(errores);
        this.cargandoDatos = false;
      },
    })
  }
}
