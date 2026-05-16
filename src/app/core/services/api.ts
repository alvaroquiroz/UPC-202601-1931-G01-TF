import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  async get(endpoint: string) {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() })
    );
    return res.data !== undefined ? res.data : res;
  }

  async post(endpoint: string, body: any) {
    const res: any = await firstValueFrom(
      this.http.post(`${this.baseUrl}${endpoint}`, body, { headers: this.getHeaders() })
    );
    return res;
  }

  async put(endpoint: string, body: any) {
    const res: any = await firstValueFrom(
      this.http.put(`${this.baseUrl}${endpoint}`, body, { headers: this.getHeaders() })
    );
    return res;
  }

  async delete(endpoint: string) {
    const res: any = await firstValueFrom(
      this.http.delete(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() })
    );
    return res;
  }
}
