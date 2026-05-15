import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  async get(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  async post(endpoint: string, body: any) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  }

  async put(endpoint: string, body: any) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  }

  async delete(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
}
