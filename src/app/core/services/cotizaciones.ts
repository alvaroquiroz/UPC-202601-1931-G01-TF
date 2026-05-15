import { inject, Injectable } from '@angular/core';
import { Cotizacion, CotizacionDetalle } from '../../interfaces/cotizacion';
import { ApiService } from './api';
import { environment } from '../../../environments/environment';

const MOCK_COTIZACIONES: Cotizacion[] = [
  { id: 1, code: 'COT-001', quotation_date: '20-04-2026', subtotal: 1200.00, igv: 216.00,  total: 1416.00, estado: 'Pendiente', general_comment: 'Entrega urgente', cliente: 'Juan Pérez',  correo_cliente: 'juan@tech.com',   empresa: 'Tech SAC',       telefono: '+51 999 111 222' },
  { id: 2, code: 'COT-002', quotation_date: '18-04-2026', subtotal: 3750.00, igv: 675.00,  total: 4425.00, estado: 'Aprobada',  general_comment: '',               cliente: 'María López', correo_cliente: 'maria@sol.com',   empresa: 'Soluciones SRL', telefono: '+51 999 333 444' },
  { id: 3, code: 'COT-003', quotation_date: '15-04-2026', subtotal:  890.00, igv: 160.20,  total: 1050.20, estado: 'Observada', general_comment: 'Verificar stock', cliente: 'Carlos Ruiz', correo_cliente: 'carlos@gn.com',   empresa: 'Grupo Norte',    telefono: '+51 999 555 666' },
  { id: 4, code: 'COT-004', quotation_date: '10-04-2026', subtotal: 6200.00, igv: 1116.00, total: 7316.00, estado: 'Aprobada',  general_comment: '',               cliente: 'Ana Torres',  correo_cliente: 'ana@imp.com',     empresa: 'Importex EIRL',  telefono: '+51 999 777 888' },
  { id: 5, code: 'COT-005', quotation_date: '05-04-2026', subtotal:  450.00, igv:  81.00,  total:  531.00, estado: 'Rechazada', general_comment: 'No disponible',  cliente: 'Luis Mamani', correo_cliente: 'luis@andina.com', empresa: 'Andina Corp',    telefono: '+51 999 999 000' },
];

const MOCK_DETALLE: CotizacionDetalle = {
  cotizacion: MOCK_COTIZACIONES[0],
  productos: [
    { producto: 'Laptop Dell XPS 15', code: 'PROD-001', quantity: 1, unit_price: 4500.00, line_subtotal: 4500.00, line_igv: 810.00, line_total: 5310.00 },
    { producto: 'Monitor LG 27"',     code: 'PROD-002', quantity: 2, unit_price: 1200.00, line_subtotal: 2400.00, line_igv: 432.00, line_total: 2832.00 },
    { producto: 'Mouse Inalámbrico',  code: 'PROD-004', quantity: 3, unit_price:  180.00, line_subtotal:  540.00, line_igv:  97.20, line_total:  637.20 },
  ]
};

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  private api = inject(ApiService);

  async getCotizaciones(estado?: string): Promise<Cotizacion[]> {
    if (!environment.production) {
      if (estado && estado !== 'Todos')
        return MOCK_COTIZACIONES.filter(c => c.estado === estado);
      return MOCK_COTIZACIONES;
    }
    const query = estado ? `?status=${estado}` : '';
    return this.api.get(`/quotations/pending${query}`);
  }

  async getCotizacion(id: number): Promise<CotizacionDetalle> {
    if (!environment.production) return MOCK_DETALLE;
    return this.api.get(`/quotations/${id}`);
  }

  async aprobar(id: number) {
    if (!environment.production) {
      const cot = MOCK_COTIZACIONES.find(c => c.id === id);
      if (cot) cot.estado = 'Aprobada';
      return { message: 'Cotización aprobada correctamente' };
    }
    return this.api.put(`/quotations/${id}/approve`, {});
  }

  async observar(id: number, comment: string) {
    if (!environment.production) {
      const cot = MOCK_COTIZACIONES.find(c => c.id === id);
      if (cot) cot.estado = 'Observada';
      return { message: 'Cambios solicitados correctamente' };
    }
    return this.api.put(`/quotations/${id}/observe`, { comment });
  }

  async rechazar(id: number, comment?: string) {
    if (!environment.production) {
      const cot = MOCK_COTIZACIONES.find(c => c.id === id);
      if (cot) cot.estado = 'Rechazada';
      return { message: 'Cotización rechazada correctamente' };
    }
    return this.api.put(`/quotations/${id}/reject`, { comment });
  }

  async getHistorial(id: number) {
    if (!environment.production) {
      return [
        { estado_anterior: 'Borrador',  estado_nuevo: 'Pendiente', cambiado_por: 'Juan Pérez',  changed_at: '20-04-2026', comment: '' },
        { estado_anterior: 'Pendiente', estado_nuevo: 'Aprobada',  cambiado_por: 'Carlos Vega', changed_at: '20-04-2026', comment: 'Todo correcto' },
      ];
    }
    return this.api.get(`/quotations/${id}/history`);
  }
}
