import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  constructor(
    private sanitizer:DomSanitizer,//para imagen
  ) { }

  //!se utiliza para la previsualizacion de imagenes seleccionadas del dispositivo para edicion de productos y usuarios en el modulo Administracion
  //Ejemplo obtenido de : https://www.youtube.com/watch?v=8GJgfk1rFUQ&t=907s
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base:null
        }) // Agregado para manejar errores
      };
    } catch (e) {
      reject(e); // Agregado para manejar errores
    }
  });

}
