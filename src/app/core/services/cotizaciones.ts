import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Cotizacion, CotizacionDetalle } from '../../interfaces/cotizacion';
import { environment } from '../../../environments/environment';

// MOCK DATA para el módulo del Vendedor
const MOCK_COTIZACIONES: Cotizacion[] = [
  { id: 1, code: 'COT-001', quotation_date: '20-04-2026', subtotal: 1200.00, igv: 216.00,  total: 1416.00, estado: 'Pendiente', general_comment: 'Entrega urgente', cliente: 'Juan Pérez',  correo_cliente: 'juan@tech.com',   empresa: 'Tech SAC',       telefono: '+51 999 111 222' },
  { id: 2, code: 'COT-002', quotation_date: '18-04-2026', subtotal: 3750.00, igv: 675.00,  total: 4425.00, estado: 'Aprobada',  general_comment: '',               cliente: 'María López', correo_cliente: 'maria@sol.com',   empresa: 'Soluciones SRL', telefono: '+51 999 333 444' },
];

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  private api = inject(ApiService);

  // 🇪🇸 MÉTODOS REALES (Tu módulo Cliente conectado a Docker)
  async getCotizacionesCliente(clienteId: number): Promise<any[]> {
    return this.api.get(`/cotizaciones?clienteId=${clienteId}`);
  }

  async getCotizacion(id: string | number): Promise<any> {
    return this.api.get(`/cotizaciones/${id}`);
  }

  async crearCotizacion(payload: any) {
    return this.api.post('/cotizaciones', payload);
  }

  // MÉTODOS MOCK (Módulo Vendedor)
  async getCotizaciones(estado?: string): Promise<Cotizacion[]> {
    if (estado && estado !== 'Todos') return MOCK_COTIZACIONES.filter(c => c.estado === estado);
    return MOCK_COTIZACIONES;
  }

  async aprobar(id: number) {
    const cot = MOCK_COTIZACIONES.find(c => c.id === id);
    if (cot) cot.estado = 'Aprobada';
    return { message: 'Cotización aprobada correctamente' };
  }

  async observar(id: number, comment: string) {
    const cot = MOCK_COTIZACIONES.find(c => c.id === id);
    if (cot) cot.estado = 'Observada';
    return { message: 'Cambios solicitados correctamente' };
  }

  async rechazar(id: number, comment?: string) {
    const cot = MOCK_COTIZACIONES.find(c => c.id === id);
    if (cot) cot.estado = 'Rechazada';
    return { message: 'Cotización rechazada correctamente' };
  }

  async getHistorial(id: number) {
    return [
      { estado_anterior: 'Borrador',  estado_nuevo: 'Pendiente', cambiado_por: 'Juan Pérez',  changed_at: '20-04-2026', comment: '' },
    ];
  }
}
