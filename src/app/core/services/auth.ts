import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, payload);
  }

  register(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    empresa: string;
    password: string;
  }) {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, payload);
  }

  forgotPassword(payload: { email: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, payload);
  }

  resetPassword(payload: { token: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, payload);
  }
}
