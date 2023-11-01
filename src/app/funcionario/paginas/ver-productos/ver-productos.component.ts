import { Component } from '@angular/core';
import { Producto, RespuestaProductos } from '../../modelos/inv-rend.model';
import { InvRendService } from '../../servicios/inv-rend.service';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent {
  productos:Producto[]=[];
  cargandoTabla=true;

  
  dtOpciones: DataTables.Settings = {//configuracion del datatable
    paging: true,
    info: true,
    //desactivar la responsividad del datatable
    responsive:false,
    pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
    /*
    lengthMenu: [5, 10, 15, 20],//habilita el selector de cantidad de registros con los siguiente numeros (lengthChange: false --> debe quitarse para que funcione)
    */
    lengthChange: false, // deshabilita el selector de cantidad de registros
    pageLength: 10, // establece la cantidad de registros por página en 10

    language: { //traducimos porque por defecto esta en ingles
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
    private servicioI:InvRendService,
    private mensajeAlertify:AlertifyService
  ){}
  
  ngOnInit(): void {
    this.cargandoTabla = true;
    this.servicioI.productosInventario()
    .subscribe({
      next:(respuesta:RespuestaProductos)=>{
        this.productos=respuesta.producto;
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

}
