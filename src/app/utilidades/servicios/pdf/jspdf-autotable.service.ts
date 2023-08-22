//https://www.youtube.com/watch?v=hMqfVGj-wQQ&t=94s
//https://www.youtube.com/watch?v=CD-DgfhGWFQ
import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ObtenerPDF } from '../../clases/pdf';

@Injectable({
  providedIn: 'root'
})
export class JspdfAutotableService {

  constructor() { }

  imprimir(encabezado:string[], cuerpo:Array<any>, titulo:string, guardar?:boolean){
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

    if(guardar){
      const hoy=new Date();
      doc.save(hoy.getDate()+hoy.getMonth()+hoy.getFullYear()+hoy.getTime()+'.pdf');
    }else{
      //// Si no se va a guardar, mostramos el PDF en el navegador
      // const pdfDataUri = doc.output('datauristring');
      // this.mostrarPDF(pdfDataUri);

      // Obtiene el objeto Blob del PDF generado
      const pdfBlob = doc.output('blob');
      
      // Llama al método para visualizar el PDF
      ObtenerPDF.visualizarPDF(pdfBlob);
      
    }
  } 

}

// Función para mostrar el PDF en el navegador
// mostrarPDF(pdfDataUri: string) {
//   console.log("Mostrando pdf")
//   const iframe = document.createElement('iframe');
//   iframe.style.width = '100%';
//   iframe.style.height = '100%';
//   iframe.src = pdfDataUri;
//   document.body.appendChild(iframe);
// }