import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';
import { DatosFiltroComparacionInv } from '../../modelos/inventariosRegistrados';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';
import { RespuestaSucursales, Sucursal } from '../../modelos/sucursal.model';

@Component({
  selector: 'app-comparacion-inventarios',
  templateUrl: './comparacion-inventarios.component.html',
  styleUrls: ['./comparacion-inventarios.component.css']
})
export class ComparacionInventariosComponent implements OnInit{

  form!: FormGroup; //formulario para filtrar cabeceras

  fechaHoy!:Date; //para establecer las fechas por defecto al filtro de las cabeceras (fecha desde)

  diasAntes!:Date;//para establecer las fechas por defecto al filtro de las cabeceras (fecha hasta)

  cargandoDatos=true; //cargando datos de cabecera ////como las sucursales

  obteniendoPDF=false;

  sucursales:Sucursal[]=[];

  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioS:SucursalService,
    private servicioInvRegistrados:InventariosRegistradosService
  ){
    this.obtenerFechas(); 
  }
  
  ngOnInit(): void {
    this.cargandoDatos=true;
  
    //establecer valores por defecto al formulario para obtener los datos iniciales
    this.form=this.formulario.group({
      fecha1:[new Date(this.diasAntes).toISOString().substring(0, 10)],
      fecha2:[new Date(this.fechaHoy).toISOString().substring(0, 10)],
      turno1:['', Validators.required],
      turno2:['', Validators.required],
      idSucursal:['', Validators.required],
    });

 
    const datosFiltro:DatosFiltroComparacionInv=this.form.value;

    this.servicioS.obtenerSucursales()
    .subscribe({
      next:(respuesta:RespuestaSucursales)=>{
        this.sucursales=respuesta.sucursal;
        this.cargandoDatos=false;
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos=false;
      }
    })
  }
  
  
  
  buscar(){
    if (!this.form.valid) {
      //los mensajes de error se visualizaran al marcar los input como tocados
      this.form.markAllAsTouched();
      return;
    }
    
    this.obteniendoPDF=true;
    console.log('this.form.value ', this.form.value)
    // const datosFiltro:DatosFiltroComparacionInv=this.form.value;
    
    // this.servicioInvRegistrados.inventariosConsecutivos(datosFiltro)
    this.servicioInvRegistrados.inventariosConsecutivos(this.form.value)
    .subscribe({
      next:(pdf:any)=>{
        console.log('buscar,', pdf)
        ObtenerPDF.visualizarPDF(pdf);
        this.obteniendoPDF=false;
      },
      error:(errores)=>{

        // console.log('errores ', errores)
        
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
          // console.log('Error ', error)
        });
        this.obteniendoPDF=false;
      }
    })
  }
  
  obtenerFechas() {
    // Obtener la fecha de hoy
    this.fechaHoy = new Date();

    // Obtener la fecha hace 7 días
    this.diasAntes = new Date();
    this.diasAntes.setDate(this.fechaHoy.getDate() - 1);
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

  mensaje(campo:string){
    let mensaje="";
    if(this.form.get(campo)?.hasError('required')){
      if(campo=="idSucursal"){
        mensaje="La sucursal es requerida";
      }
      
      if(campo=="turno1"){
        mensaje="El turno 1 es requerido";
      }


      if(campo=="turno2"){
        mensaje="El turno  es requerido";
      }

      if(campo=="fecha1"){
        mensaje="La fecha 1 es requerida";
      }

      if(campo=="fecha2"){
        mensaje="La fecha 2 es requerida";
      }
    }
    
    return mensaje;
  }


}
