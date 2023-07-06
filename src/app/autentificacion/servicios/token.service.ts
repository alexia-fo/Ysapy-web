import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  guardarToken(token: string) {
    localStorage.setItem('token_ysapy', token);
  }

  retornarToken() {
    const token = localStorage.getItem('token_ysapy');
    return token;
  }

  removerToken() {
    localStorage.removeItem('token_ysapy');
  }
}
