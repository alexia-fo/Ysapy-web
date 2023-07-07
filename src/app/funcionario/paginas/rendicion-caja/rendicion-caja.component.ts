import { Component } from '@angular/core';
import { Dinero, RespuestaDatosDinero } from '../../modelos/inventario.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rendicion-caja',
  templateUrl: './rendicion-caja.component.html',
  styleUrls: ['./rendicion-caja.component.css']
})
export class RendicionCajaComponent {
  dineros: Dinero[]=[];//lista para la tabla
  invHabilitado:boolean=false;
  descripcion:string='';
  cargandoTabla:boolean = false; //obteniendo los datos a mostrar en la tabla
  form = new FormGroup({}); //formulario
  cargando!: boolean; //registro de rendicion en proceso

  dtOptions = {
    paging:false,
    info:false,
    responsive:false,

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
    private servicioR: InvRendService
  ) {

  }

  ngOnInit(): void {
    this.servicioR.obtenerDatosDinero()
    .subscribe({
      next:(respuesta:RespuestaDatosDinero)=>{
        console.log('suscribe: ', respuesta)
        this.descripcion=respuesta.descripcion;
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.dineros=respuesta.dineros!;
                
          this.dineros.forEach(dinero => {
            this.form.addControl(dinero.idBillete.toString(), new FormControl(0, [Validators.required, Validators.min(0)]));
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

  //falta
  enviar(){
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    let rendicion = {dineros:this.form.value } ;
    this.cargando = true;


    this.servicioR.registrarRendicion(rendicion).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta)
        this.cargando = false;
        $('#modal').modal('hide');
        this.mensajeAlertify.mensajeExito(
          `Se ha registrado correctamente ✓✓`
        );
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        console.log(errores);
        this.cargando = false;
      },
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

}
