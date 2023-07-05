
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../autentificacion/servicios/token.service';


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

/*
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shouldSkipInterception(request)) {
      return next.handle(request);
    }

    const token = this.tokenService.retornarToken() || "";
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('x-token', token)
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }

  private shouldSkipInterception(request: HttpRequest<unknown>): boolean {
    // Verificar si la solicitud es para obtener un archivo PDF
    return request.url.endsWith('.pdf');
  }
}
*/