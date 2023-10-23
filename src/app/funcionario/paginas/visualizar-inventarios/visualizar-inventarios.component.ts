import { Component } from '@angular/core';
import { DetInventario, RespuestaDatosVisualizarInv } from '../../modelos/inv-rend.model';
import { InvRendService } from '../../servicios/inv-rend.service';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';

@Component({
  selector: 'app-visualizar-inventarios',
  templateUrl: './visualizar-inventarios.component.html',
  styleUrls: ['./visualizar-inventarios.component.css']
})
export class VisualizarInventariosComponent {

  dinventario:DetInventario[]=[];
  cargandoDatos=true;
  
  invHabilitado:boolean=false;
  descripcion:string='';
  fechaApertura:Date | undefined;
  idCabeceraInv:number  | undefined;

  constructor(
    private servicioI:InvRendService,
    private mensajeAlertify:AlertifyService
  ){}
  
  ngOnInit(): void {
    this.cargandoDatos = true;
    this.servicioI.obtenerDatosVisualizar()
    .subscribe({
      next:(respuesta:RespuestaDatosVisualizarInv)=>{

        console.log(respuesta)

        this.descripcion=respuesta.descripcion;
        this.fechaApertura=respuesta.fechaApertura;
        this.idCabeceraInv=respuesta.idCabeceraInv;
            
        if(respuesta.mostrar){
          this.invHabilitado=true;
          this.dinventario=respuesta.dinventario!;
          
          
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
