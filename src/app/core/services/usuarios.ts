import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';

const MOCK_USUARIOS: Usuario[] = [
  { id: 1, first_name: 'Juan',   last_name: 'Pérez',  email: 'juan@tech.com',        phone: '+51 999 111 222', status: 'activo',   role: 'cliente',  empresa: 'Tech SAC',       cotizaciones: 5  },
  { id: 2, first_name: 'María',  last_name: 'López',  email: 'maria@sol.com',        phone: '+51 999 333 444', status: 'activo',   role: 'cliente',  empresa: 'Soluciones SRL', cotizaciones: 3  },
  { id: 3, first_name: 'Carlos', last_name: 'Ruiz',   email: 'carlos@gn.com',        phone: '+51 999 555 666', status: 'activo',   role: 'cliente',  empresa: 'Grupo Norte',    cotizaciones: 8  },
  { id: 4, first_name: 'Ana',    last_name: 'Torres', email: 'ana@imp.com',           phone: '+51 999 777 888', status: 'activo',   role: 'cliente',  empresa: 'Importex EIRL',  cotizaciones: 2  },
  { id: 5, first_name: 'Luis',   last_name: 'Mamani', email: 'luis@andina.com',      phone: '+51 999 999 000', status: 'inactivo', role: 'cliente',  empresa: 'Andina Corp',    cotizaciones: 11 },
  { id: 6, first_name: 'Rosa',   last_name: 'Quispe', email: 'rosa@dig.com',          phone: '+51 999 112 233', status: 'activo',   role: 'cliente',  empresa: 'Digital SAC',    cotizaciones: 4  },
  { id: 7, first_name: 'Carlos', last_name: 'Vega',   email: 'carlos@emp.com',       phone: '+51 999 221 333', status: 'activo',   role: 'vendedor', empresa: '',               cotizaciones: 0  },
  { id: 8, first_name: 'Ana',    last_name: 'Ríos',   email: 'ana@emp.com',           phone: '+51 999 441 555', status: 'activo',   role: 'vendedor', empresa: '',               cotizaciones: 0  },
  { id: 9, first_name: 'Admin',  last_name: 'Sistema',email: 'admin@cotizaciones.com',phone: '',               status: 'activo',   role: 'admin',    empresa: '',               cotizaciones: 0  },
];
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private api = inject(ApiService);

  async getUsuarios(): Promise<Usuario[]> {
    if (!environment.production) return MOCK_USUARIOS;
    return this.api.get('/admin/users');
  }

  async getUsuario(id: number): Promise<Usuario> {
    if (!environment.production) {
      return MOCK_USUARIOS.find(u => u.id === id) ?? MOCK_USUARIOS[0];
    }
    return this.api.get(`/admin/users/${id}`);
  }

  async editarUsuario(id: number, body: Partial<Usuario>) {
    if (!environment.production) {
      const idx = MOCK_USUARIOS.findIndex(u => u.id === id);
      if(idx !== -1) MOCK_USUARIOS[idx] = { ...MOCK_USUARIOS[idx], ...body };
      return { message: 'Usuario actualizado correctamente' };
    }
    return this.api.put(`/admin/users/${id}`, body);
  }

  async bloquearUsuario(id: number) {
    if (!environment.production) {
      const u = MOCK_USUARIOS.find(u => u.id === id);
      if(u) u.status = u.status === 'activo' ? 'inactivo' : 'activo';
      return { message: 'Estado actualizado correctamente' };
    }
    return this.api.put(`/admin/users/${id}/block`, {});
  }

  async eliminarUsuario(id: number) {
    if (!environment.production) {
      return { message: 'Usuario eliminado correctamente' };
    }
    return this.api.delete(`/admin/users/${id}`);
  }

}
