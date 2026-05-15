import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api';
import { Producto } from '../../interfaces/producto';

const MOCK_PRODUCTOS: Producto[] = [
  { id: 1, code: 'PROD-001', name: 'Laptop Dell XPS 15',  description: 'Laptop profesional 15"',      unit_price: 4500.00, stock: 10, status: 'activo' },
  { id: 2, code: 'PROD-002', name: 'Monitor LG 27"',       description: 'Monitor 4K IPS',              unit_price: 1200.00, stock: 15, status: 'activo' },
  { id: 3, code: 'PROD-003', name: 'Teclado Mecánico',     description: 'Teclado mecánico RGB',         unit_price:  350.00, stock: 20, status: 'activo' },
  { id: 4, code: 'PROD-004', name: 'Mouse Inalámbrico',    description: 'Mouse ergonómico inalámbrico', unit_price:  180.00, stock: 25, status: 'activo' },
  { id: 5, code: 'PROD-005', name: 'Auriculares Sony',     description: 'Auriculares noise cancelling', unit_price:  650.00, stock: 12, status: 'activo' },
  { id: 6, code: 'PROD-006', name: 'Webcam Logitech',      description: 'Webcam 4K videoconferencias',  unit_price:  420.00, stock: 18, status: 'activo' },
];

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private api = inject(ApiService);

  async getProductos(): Promise<Producto[]> {
    if (!environment.production) return MOCK_PRODUCTOS;
    return this.api.get('/products');
  }

  async getProducto(id: number): Promise<Producto> {
    if (!environment.production) {
      return MOCK_PRODUCTOS.find(p => p.id === id) ?? MOCK_PRODUCTOS[0];
    }
    return this.api.get(`/products/${id}`);
  }
}
