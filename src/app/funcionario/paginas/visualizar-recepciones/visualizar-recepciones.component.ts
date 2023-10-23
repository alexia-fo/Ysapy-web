import { Component, OnInit } from '@angular/core';
import { RecepcionVisualizar, RespuestaDatosVisualizarRecepcion } from '../../modelos/recepcion-productos.model';
import { RecepcionProductosService } from '../../servicios/recepcion-productos.service';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';

@Component({
  selector: 'app-visualizar-recepciones',
  templateUrl: './visualizar-recepciones.component.html',
  styleUrls: ['./visualizar-recepciones.component.css']
})
export class VisualizarRecepcionesComponent implements OnInit{
  
  drecpciones:RecepcionVisualizar[]=[];
  cargandoDatos=true;
  
  invHabilitado:boolean=false;
  descripcion:string='';
  fechaApertura:Date | undefined;
  idCabeceraInv:number  | undefined;

  constructor(
    private servicioR:RecepcionProductosService,
    private mensajeAlertify:AlertifyService
  ){}
  
  ngOnInit(): void {
    this.cargandoDatos = true;
    this.servicioR.obtenerDatosVisualizar()
    .subscribe({
      next:(respuesta:RespuestaDatosVisualizarRecepcion)=>{
        console.log(respuesta)
        this.descripcion=respuesta.descripcion;
        this.fechaApertura=respuesta.fechaApertura;
        this.idCabeceraInv=respuesta.idCabeceraInv;
            
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.drecpciones=respuesta.drecepcion!;
          
          
        }
        this.cargandoDatos = false;      
      },
      error:(errores)=>{
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        
        this.cargandoDatos = false;
      }
    });
  }
}
