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
}
