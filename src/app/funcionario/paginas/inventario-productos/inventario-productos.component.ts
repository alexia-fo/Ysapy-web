import { Component } from '@angular/core';
import { Producto, RespuestaDatosProducto } from '../../modelos/inventario.model';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { InvRendService } from '../../servicios/inv-rend.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { respuestaMensaje } from 'src/app/compartidos/modelos/resupuestaBack';
@Component({
  selector: 'app-inventario-productos',
  templateUrl: './inventario-productos.component.html',
  styleUrls: ['./inventario-productos.component.css']
})
export class InventarioProductosComponent {
  productos: Producto[]=[]; //lista para tabla
  invHabilitado:boolean=false;
  descripcion:string='';
  cargandoTabla:boolean = false; //obteniendo los datos a mostrar en la tabla
  
  form = new FormGroup({}); //formulario
  cargandoOperacion!: boolean; //registro de inv en proceso
  
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
    private servicioI: InvRendService
  ) {
  }

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

    let inventario = {productos:this.form.value } ;
    this.cargandoOperacion = true;

    this.servicioI.registrarInventario(inventario).subscribe({
      next: (respuesta: respuestaMensaje) => {
        this.cargandoOperacion = false;
        //$('#modal').modal('hide');
        this.mensajeAlertify.mensajeExito(
          `${respuesta.msg}`
        );
        this.consultarDetalle();
      },
      error: (errores: string[]) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoOperacion = false;
      },
    });

  }

  consultarDetalle(){
    this.form.reset();//para limpiar al volver a mostrar luego de guardar

    this.cargandoTabla = true;
    this.servicioI.obtenerDatosProducto()
    .subscribe({
      next:(respuesta:RespuestaDatosProducto)=>{
        this.descripcion=respuesta.descripcion;
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.productos=respuesta.productos!;
                
          this.productos.forEach(product => {
            this.form.addControl(product.idProducto.toString(), new FormControl(0, [Validators.required, Validators.min(0)]));
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
        
        this.cargandoTabla = false;
      }
    });
  }

  //PARA MOSTRAR EL TOTAL DE CADA PRODUCTO SI ES NECESARIO (CON FORMCONTROL)
  /*
  total(idProducto:number, precio:number){
    let total=precio* Number(this.form.get(idProducto.toString())?.value);
    return total;
  }
  */

  //CON NG MODEL
  /*

  actualizarCantidad(producto: Producto){
    if (!producto.cantidad) {
      console.log("if",producto.cantidad)
      producto.cantidad = 0;
    }
    console.log("no if",producto.cantidad)

  }
  */

}
