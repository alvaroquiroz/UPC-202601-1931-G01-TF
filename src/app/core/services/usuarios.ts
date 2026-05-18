import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class usuariosService {

  private api = inject(ApiService);

  async getUsuarios(): Promise<Usuario[]> {
    return this.api.get('/admin/usuarios');
  }

  async getUsuario(id: number): Promise<Usuario> {
    const data = await this.api.get('/admin/usuarios');
    return data.find((u: any) => u.id === id);
  }
}
