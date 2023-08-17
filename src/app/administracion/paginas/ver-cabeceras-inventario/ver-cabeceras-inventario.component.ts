import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RespuestaCabecera, datosCabecera } from '../../modelos/ver-calculos-rendicion';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { VerCalculosRendicionService } from '../../servicios/ver-calculos-rendicion.service';
import { Router } from '@angular/router';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';
import { SucursalService } from '../../servicios/sucursal.service';
import { RespuestaSucursales, Sucursal } from '../../modelos/sucursal.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ver-cabeceras-inventario',
  templateUrl: './ver-cabeceras-inventario.component.html',
  styleUrls: ['./ver-cabeceras-inventario.component.css']
})
export class VerCabecerasInventarioComponent implements OnInit{

  modalFiltros="modalFiltros";
  
  form!: FormGroup; 
  
  //cargandoTabla = true; //obteniendo los datos a mostrar en la tabla
  
  // dtOpciones: DataTables.Settings = {//configuracion del datatable
  //   paging:false,
  //   info:false,

  //   responsive: true,

  //   /*
  //   paging: true,
  //   info: true,
  //   pagingType: 'simple_numbers', //para paginacion de abajo //full_numbers
  //   pageLength: 10, // establece la cantidad de registros por página en 10
  //   */
  //   /*
  //   lengthMenu: [5, 10, 15, 20],//habilita el selector de cantidad de registros con los siguiente numeros (lengthChange: false --> debe quitarse para que funcione)
  //   */
  //  lengthChange: false, // deshabilita el selector de cantidad de registros
   
  //  language: { //traducimos porque por defecto esta en ingles
  //   search: 'Buscar:',
  //   zeroRecords: 'No se encontraron resultados',
  //   info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
  //   infoEmpty: 'Mostrando 0 a 0 de 0 registros',
  //   infoFiltered: '(filtrados de _MAX_ registros en total)',
  //   lengthMenu: 'Mostrar _MENU_ registros',
  //   loadingRecords: 'Cargando...',
  //   processing: 'Procesando...',
  //     emptyTable: 'No hay datos disponibles en la tabla',
  //     paginate: {
  //       first: 'Primero',
  //       last: 'Último',
  //       next: 'Siguiente',
  //       previous: 'Anterior',
  //     },
  //   },
  // };
  dtOpciones: DataTables.Settings = {
    paging: false,
    info: false,
    responsive: true,
    lengthChange: false,
    language: {
      // ... tu configuración de idioma ...
    },
    initComplete: () => {
      $('table').on('click', '[id^="btnCalculos_"]', (event) => {
        const idCabecera = event.currentTarget.id.split('_')[1];
        this.verCalculos(idCabecera);
      });
  
      $('table').on('click', '[id^="btnDetalle_"]', (event) => {
        const idCabecera = event.currentTarget.id.split('_')[1];
        this.redirigirADetalleRendicion(idCabecera);
      });
    }
  };
  


  fechaHoy!:Date;
  fechaHace7Dias!:Date;

  cabeceras:datosCabecera[]=[];

  sucursales:Sucursal[]=[];

  cargandoDatos=true;

  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioC: VerCalculosRendicionService,
    private router: Router,
    private servicioS:SucursalService
  ){
    this.obtenerFechas();
  }
  
  ngOnInit(): void {
    this.form=this.formulario.group({//Validators.pattern(/^[a-zA-Z() ñ]+$/)
      desde:[''],
      hasta:[''],
      sucursal:['todos'],
      estado:['todos'],
      turno:['todos'],
    
    });

    ////establecer en formulario
    this.form.get('desde')?.setValue(new Date(this.fechaHace7Dias).toISOString().substring(0, 10));
    this.form.get('hasta')?.setValue(new Date(this.fechaHoy).toISOString().substring(0, 10));


    const {desde, hasta} = this.form.value;
    console.log(desde)
    
    /////////
  //   this.servicioC.obtenerCabeceras(desde, hasta)
  //   .subscribe({
  //     next: (respuesta:RespuestaCabecera) => {
  //       this.cabeceras=respuesta.cabecera
  //     },
  //     error: (errores) => {
  //       errores.forEach((error: string) => {
  //         this.mensajeAlertify.mensajeError(error);
  //       });
  //     },
  //   });

  //   this.servicioS.obtenerSucursales()
  //   .subscribe({
  //     next: (respuesta:RespuestaSucursales) => {
  //       this.sucursales=respuesta.sucursal
  //     },
  //     error: (errores) => {
  //       errores.forEach((error: string) => {
  //         this.mensajeAlertify.mensajeError(error);
  //       });
  //     },
  //   });
  // Realiza las consultas iniciales y de sucursales usando forkJoin
  this.cargandoDatos=true;
  forkJoin([
    //el formulario por defecto ya tiene los valores
    this.servicioC.obtenerCabeceras(this.form.value),
    this.servicioS.obtenerSucursales()
  ]).subscribe({
    next: ([cabecerasRespuesta, sucursalesRespuesta]) => {
      // Procesa las respuestas de las consultas
    this.cabeceras = cabecerasRespuesta.cabecera;
    this.sucursales = sucursalesRespuesta.sucursal;
    this.cargandoDatos=false;
  },
  error: (errores) => {
    errores.forEach((error: string) => {
      this.mensajeAlertify.mensajeError(error);
    });
    this.cargandoDatos=false;

  }
  });

}



  obtenerFechas() {
    // Obtener la fecha de hoy
    this.fechaHoy = new Date();

    // Obtener la fecha hace 7 días
    this.fechaHace7Dias = new Date();
    this.fechaHace7Dias.setDate(this.fechaHoy.getDate() - 15);

  }

  verCalculos(idCabecera:number){
    //this.router.navigate([`/calculoRendicion/${idCabecera}`]);
    this.router.navigateByUrl(`/administracion/calculoRendicion/${idCabecera}`);
  }

  buscar(){

    // const {desde, hasta} = this.form.value;
    // console.log(desde, hasta)
    // /////////
    // this.servicioC.obtenerCabeceras(desde, hasta)
    // .subscribe({
    //   next: (respuesta:RespuestaCabecera) => {
    //     console.log(respuesta)
    //     this.cabeceras=respuesta.cabecera
    //   },
    //   error: (errores) => {
    //     errores.forEach((error: string) => {
    //       this.mensajeAlertify.mensajeError(error);
    //     });
    //   },
    // });
    this.cargandoDatos=true;

    const data = this.form.value;
  
    this.servicioC.obtenerCabeceras(data)
    .subscribe({
      next: (respuesta:RespuestaCabecera) => {
        this.cabeceras=respuesta.cabecera
        console.log(this.cabeceras)
        this.cargandoDatos=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos=false;
      },
    });

  }


  ///////pdf//////////

  // ver(){
  //   this.servicioC.obtenerCabecerasPDF()
  //   .subscribe({
  //       next:(pdfData: Blob) => {
  //         ObtenerPDF.visualizarPDF(pdfData);
  //         // this.servicioPDF.visualizarPDF(pdfData);
  //       },
  //       error:(error) => {
  //         console.error('Error al obtener el PDF:', error);
  //       }
  //     }
  //   );
  // }

  // descargar(){
  //   this.servicioC.obtenerCabecerasPDF().subscribe({
  //       next:(pdfData: Blob) => {
  //         ObtenerPDF.descargarPDF(pdfData);
  //         // this.servicioPDF.descargarPDF(pdfData);
  //       },
  //       error:(error) => {
  //         console.error('Error al obtener el PDF:', error);
  //       }
  //     }
  //   );
  // }

    // ------ MODAL DE FORMULARIO ------ //

    mostrarModal(id: string, mostrar:boolean) {
      if(mostrar){
        $(`#${id}`).modal('show');
      }else{
        $(`#${id}`).modal('hide');
      }
    }

    //prueba
    redirigirADetalleRendicion(idCabecera: number) {
      // this.router.navigate([`./detalleRendicion/${idCabecera}`, idCabecera]);
      this.router.navigateByUrl(`/administracion/detalleRendicion/${idCabecera}`);
    }
  
}
