import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLinkWithHref,SlicePipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit{
  private router = inject(Router);
  private cotService = inject(CotizacionesService);

  usuarios = signal<any[]>([]);
  filtro = signal<string>('Todos');

  usuariosFiltrados = computed(() => {
    if (this.filtro() === 'Todos') return this.usuarios();
    return this.usuarios().filter(u => u.role.toLowerCase() === this.filtro().toLowerCase());
  });

  async ngOnInit() {
    try {
      const data = await this.cotService.getUsuarios();
      this.usuarios.set(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  filtrar(rol: string){
    this.filtro.set(rol);
  }

  async bloquear(usuario: any) {
    try {
      await this.cotService.bloquearUsuario(usuario.id);
      usuario.status = usuario.status === 'activo' ? 'inactivo' : 'activo';
    } catch (error) {
      console.error('Error al bloquear usuario:', error);
    }
  }

  async eliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await this.cotService.eliminarUsuario(id);
      this.usuarios.set(this.usuarios().filter((u: any) => u.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
