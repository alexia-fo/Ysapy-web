import { Component, OnInit } from '@angular/core';
import { RespuestaDatosVisualizarSalida, SalidaVisualizar } from '../../modelos/salida-productos.model';
import { SalidaProductosService } from '../../servicios/salida-productos.service';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';

@Component({
  selector: 'app-visualizar-salidas',
  templateUrl: './visualizar-salidas.component.html',
  styleUrls: ['./visualizar-salidas.component.css']
})
export class VisualizarSalidasComponent implements OnInit {

  dsalidas:SalidaVisualizar[]=[];
  cargandoDatos=true;
  
  invHabilitado:boolean=false;
  descripcion:string='';
  fechaApertura:Date | undefined;
  idCabeceraInv:number  | undefined;

  constructor(
    private servicioS:SalidaProductosService,
    private mensajeAlertify:AlertifyService
  ){}
  
  ngOnInit(): void {
    this.cargandoDatos = true;
    this.servicioS.obtenerDatosVisualizar()
    .subscribe({
      next:(respuesta:RespuestaDatosVisualizarSalida)=>{
        this.descripcion=respuesta.descripcion;
        this.fechaApertura=respuesta.fechaApertura;
        this.idCabeceraInv=respuesta.idCabeceraInv;
            
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.dsalidas=respuesta.dsalida!;
          
          
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
