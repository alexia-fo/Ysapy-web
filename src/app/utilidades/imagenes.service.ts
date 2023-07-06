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

  crear(id: number, coleccion: string, formData: FormData): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${coleccion}/${id}`, formData)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.error.msg));
        })
      );
  }

  obtener(id: number, coleccion: string) {
    //se especifica que sea de tipo blob para que no se interprete como json
    //y genere un error

    return this.http
      .get(`${this.apiUrl}/${coleccion}/${id}`, { responseType: 'blob' })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          return throwError(() => new Error(response.message));
        })
      );
  }
}
