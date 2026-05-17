import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Cotizacion, CotizacionDetalle } from '../../interfaces/cotizacion';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  private api = inject(ApiService);

  // 🇪🇸 MÉTODOS REALES (Tu módulo Cliente conectado a Docker)
  async getCotizacionesCliente(clienteId: number): Promise<any[]> {
    return this.api.get(`/cotizaciones?clienteId=${clienteId}`);
  }

  async crearCotizacion(payload: any) {
    return this.api.post('/cotizaciones', payload);
  }

  // Módulo Vendedor
  async getCotizaciones(estado?: string): Promise<Cotizacion[]> {
    const user = JSON.parse(localStorage.getItem('access_token') || '{}');
    const vendor_id = user?.id || 2;
    const query = estado && estado !== 'Todos'
      ? `?vendor_id=${vendor_id}&status=${estado}`
      : `?vendor_id=${vendor_id}`;
    return this.api.get(`/vendedor/cotizaciones${query}`);
  }

  async getCotizacion(id: string | number): Promise<any> {
    return this.api.get(`/vendedor/cotizaciones/${id}`);
  }

  async aprobar(id: number) {
    const user = JSON.parse(localStorage.getItem('access_token') || '{}');
    return this.api.put(`/vendedor/cotizaciones/${id}/aprobar`, { user_id: user?.id || 2 });
  }

  async observar(id: number, comment: string) {
    const user = JSON.parse(localStorage.getItem('access_token') || '{}');
    return this.api.put(`/vendedor/cotizaciones/${id}/observar`, { user_id: user?.id || 2, comment });
  }

  async rechazar(id: number, comment?: string) {
    const user = JSON.parse(localStorage.getItem('access_token') || '{}');
    return this.api.put(`/vendedor/cotizaciones/${id}/rechazar`, { user_id: user?.id || 2, comment });
  }

  async getHistorial(id: number) {
    return this.api.get(`/vendedor/cotizaciones/${id}/historial`);
  }
}
