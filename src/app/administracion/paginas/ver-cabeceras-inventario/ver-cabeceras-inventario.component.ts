import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RespuestaCabecera, datosCabecera } from '../../modelos/inventariosRegistrados';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { Router } from '@angular/router';
import { SucursalService } from '../../servicios/sucursal.service';
import { Sucursal } from '../../modelos/sucursal.model';
import { forkJoin } from 'rxjs';
//para formatos de datos del pdf
import { format } from 'date-fns'; // Importa la función de formateo 
import { TitleCasePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
//para generar pdf
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { ObtenerPDF } from 'src/app/utilidades/clases/pdf';
import { InventariosRegistradosService } from '../../servicios/inventarios-registrados.service';

@Component({
  selector: 'app-ver-cabeceras-inventario',
  templateUrl: './ver-cabeceras-inventario.component.html',
  styleUrls: ['./ver-cabeceras-inventario.component.css'],
  //inyectar pipes
  providers:[TitleCasePipe, DecimalPipe]
})
export class VerCabecerasInventarioComponent implements OnInit{

  modalFiltros="modalFiltros";
  
  form!: FormGroup; //formulario para filtrar cabeceras

  dtOpciones: DataTables.Settings = {
    paging: false,
    info: false,
    responsive: false,
    lengthChange: false,
    ordering:false,
    // order: [[0, 'desc']], // Ordenar por la primera columna (0) en orden ascendente ('asc')
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
    // initComplete: () => {
    //   $('table').on('click', '[id^="btnCalculos_"]', (event) => {
    //     const idCabecera = event.currentTarget.id.split('_')[1];
    //     this.verCalculos(idCabecera);
    //   });
  
    //   $('table').on('click', '[id^="btnDetalle_"]', (event) => {
    //     const idCabecera = event.currentTarget.id.split('_')[1];
    //     this.verDetalle(idCabecera);
    //   });
    // }
  };

  fechaHoy!:Date; //para establecer las fechas por defecto al filtro de las cabeceras (fecha desde)

  diasAntes!:Date;//para establecer las fechas por defecto al filtro de las cabeceras (fecha hasta)

  cabeceras:datosCabecera[]=[]; //para el listado de cabeceras en la tabla

  sucursales:Sucursal[]=[]; //para el combo de sucursales en ventana de filtro

  cargandoDatos=true; //cargando datos de cabecera

  constructor(
    private formulario:FormBuilder,
    private mensajeAlertify: AlertifyService,
    private servicioC: InventariosRegistradosService,
    private router: Router,
    private servicioS:SucursalService,
    //para formatos de datos en pdf
    private titlecasePipe: TitleCasePipe,
    private decimalPipe: DecimalPipe
  ){
    this.obtenerFechas();
  }
  
  ngOnInit(): void {
    //establecer valores por defecto al formulario para obtener los datos iniciales
    this.form=this.formulario.group({
      desde:[new Date(this.diasAntes).toISOString().substring(0, 10)],
      hasta:[new Date(this.fechaHoy).toISOString().substring(0, 10)],
      sucursal:['todos'],
      estado:['todos'],
      turno:['todos'],
    });

    // Realiza la consulta incicial para obtener las cabeceras, y las sucursales para la ventana de filtro
    this.cargandoDatos=true;
    forkJoin([
      //el formulario por defecto ya cuenta con valores por defecto
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
    this.diasAntes = new Date();
    this.diasAntes.setDate(this.fechaHoy.getDate() - 15);
  }

  //para filtrar los datos de la cabecera
  buscar(){
    this.cargandoDatos=true;
    this.servicioC.obtenerCabeceras(this.form.value)
    .subscribe({
      next: (respuesta:RespuestaCabecera) => {
        this.cabeceras=respuesta.cabecera;       
        this.cargandoDatos=false;
      },
      error: (errores) => {
        errores.forEach((error: string) => {
          this.mensajeAlertify.mensajeError(error);
        });
        this.cargandoDatos=false;
      },
    });

    this.mostrarModal(this.modalFiltros, false);

  }

  verCalculos(idCabecera:number){
    this.router.navigateByUrl(`/administracion/calculoRendicion/${idCabecera}`);
  }

  verDetalle(idCabecera: number) {
    this.router.navigateByUrl(`/administracion/verRendicion/${idCabecera}`);
  }

  editar(idCabecera: number) {
    this.router.navigateByUrl(`/administracion/editarInventarios/${idCabecera}`);
  }

  // ------ MODAL DE FORMULARIO ------ //

  mostrarModal(id: string, mostrar:boolean) {
    if(mostrar){
      $(`#${id}`).modal('show');
    }else{
      $(`#${id}`).modal('hide');
    }
  }

  //PDF

  mostrarPDF() {
    const encabezado = ['Apertura', 'Cierre', 'Sucursal', 'Turno', 'Apertura', 'Cierre', 'Diferencia', 'Pendiente'];
    const cuerpo = this.cabeceras.map(item => [
      format(new Date(item.fechaApertura), 'yyyy/MM/dd'), // Formatea la fecha
      format(new Date(item.fechaCierre), 'yyyy/MM/dd'), // Formatea la fecha
      /*
      '1' indica que se debe usar el separador de miles,
      '0' indica que no se deben mostrar decimales y '-' 
      indica que no se debe mostrar ningún número negativo.
      */
      this.titlecasePipe.transform(item.Sucursal.nombre),
      this.titlecasePipe.transform(item.turno),
      this.decimalPipe.transform(item.montoApertura, '1.0-0'), // Formatea el monto con separadores de miles
      this.decimalPipe.transform(item.montoCierre, '1.0-0'),   // Formatea el monto con separadores de miles
      this.decimalPipe.transform(item.montoDiferencia, '1.0-0'), // Formatea el monto con separadores de miles
      this.decimalPipe.transform(item.montoPendiente, '1.0-0'),  // Formatea el monto con separadores de miles
    ]);

    const titulo = 'Datos de Inventario';
    
    // this.pdfService.imprimir(encabezado, cuerpo, titulo, false);
    // this.pdfService.imprimir(encabezado, cuerpo, titulo, false);

    //!GENERAR PDF

    const doc= new jsPDF({
      orientation:"portrait",
      unit:"px",
      format:"letter"
    });

    doc.text(titulo, doc.internal.pageSize.width/ 2, 25, {align:'center'});

    autoTable ( doc ,  { 
      head : [ encabezado ] , 
      body : cuerpo, 
      theme:'plain'

    } )

    // Obtiene el objeto Blob del PDF generado
    const pdfBlob = doc.output('blob');
    
    // Llama al método para visualizar el PDF
    ObtenerPDF.visualizarPDF(pdfBlob);
      
  }

}

//!ahora ya no es necesario

