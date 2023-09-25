
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../autentificacion/servicios/token.service';
/*FIXME:
Este interceptor se encarga de modificar las solicitudes HTTP antes de que se envíen al servidor para 
agregar un token de autenticación a las cabeceras de la solicitud.

Método intercept:Este método es parte de la implementación de HttpInterceptor y se ejecuta cada vez que se realiza una solicitud HTTP.

Método Privado addToken(request: HttpRequest<unknown>):Este método toma una solicitud HTTP como entrada y verifica si hay un token de autenticación disponible.
Si se encuentra un token, se clona la solicitud original y se le agrega el token a través de la cabecera HTTP x-token. El método request.clone() se utiliza para crear 
una copia inmutable de la solicitud original con las modificaciones necesarias.
Si no se encuentra un token, la solicitud original se devuelve sin cambios.

(Para utilizarlo se debe registrarlo en la lista de interceptores proporcionados en el modulo -en este caso appModule)

Agregar el interceptor a un módulo específico en lugar del módulo raíz (como AppModule) puede ser útil si se desea aplicar el interceptor solo a las solicitudes 
HTTP realizadas dentro de ese módulo o sus componentes.
*/
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService:TokenService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request=this.addToken(request);
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>){
    const token=this.tokenService.retornarToken() || "";
    if(token){
      const authReq=request.clone({
        headers: request.headers.set('x-token', token)
      });
      return authReq;
    }
    return request;
  }
}

