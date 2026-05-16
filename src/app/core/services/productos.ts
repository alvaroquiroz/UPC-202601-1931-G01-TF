import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Producto } from '../../interfaces/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private api = inject(ApiService);

  async getProductos(): Promise<Producto[]> {
    return this.api.get('/productos');
  }
}
