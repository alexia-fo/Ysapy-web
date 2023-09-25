import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagenesService {
  private apiUrl = `${environment.API_URL}/api/uploads`;

  constructor(private http: HttpClient) { }
  //!se utiliza para la registrar imagenes al editar productos y usuarios en el modulo Administracion

    /*
    La función toma tres argumentos:

    id: El identificador o ID del elemento al que se asociará la imagen (por ejemplo, el ID del usuario o del producto).
    coleccion: Una cadena que representa la colección o el tipo de elemento al que se está asociando la imagen (por ejemplo, "usuarios" o "productos").
    formData: Un objeto FormData que contiene la imagen.
    
    La URL se construye utilizando el id y la coleccion proporcionados, lo que significa que la imagen se registrará asociada a un elemento específico en una colección específica.

  */
  crear(id: number, coleccion: string, formData: FormData): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${coleccion}/${id}`, formData)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg));
        })
      );
  }

  //TODO: para obtener imagenes de una coleccion (ejemplo: para visualizar, por ahora no uso pq agrego el url al src de una imagen)
  // obtener(id: number, coleccion: string) {
  //   //se especifica que sea de tipo blob para que no se interprete como json
  //   //y genere un error

  //   return this.http
  //     .get(`${this.apiUrl}/${coleccion}/${id}`, { responseType: 'blob' })
  //     .pipe(
  //       catchError((response: HttpErrorResponse) => {
  //         return throwError(() => new Error(response.message));
  //       })
  //     );
  // }
}
