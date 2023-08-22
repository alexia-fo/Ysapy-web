import { Injectable } from '@angular/core';


import {jsPDF} from 'jspdf';
//import html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root'
})
export class JspdfHtml2canvasService {

  constructor() { }

  dowloadPDF():void{
    const doc=new jsPDF();

    doc.text('hello world', 10, 10);
    doc.save('hello-world.pdf');
  }

  dowload(DATA:any){
    //const DATA=document.getElementById('htmlData');
    //p>potrait
    //pt>puntos
    //a4>hoja
    const doc = new jsPDF('p', 'pt', 'a4');

    const options={
      background:'white',
      scale:3,

    };

    html2canvas(DATA, options)
    .then((canvas)=>{
      const img=canvas.toDataURL('image/PNG');

      //add img canvas to pdf

      const bufferX=15;
      const bufferY=15;

      const imgProps=(doc as any).getImageProperties(img);
      const pdfWidth=doc.internal.pageSize.getWidth()-2 * bufferX;

      const pdfHeight=(imgProps.height * pdfWidth)/imgProps.width;

      doc.addImage(
        img,
        'PNG',
        bufferX,
        bufferY,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      return doc;
    })
    .then((docResult)=>{
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`)
    })
  }
}
