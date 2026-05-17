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

  bloquear(usuario: any){
    usuario.status = usuario.status === 'Activo' ? 'Inactivo' : 'Activo';
  }

  eliminar(id: number){
    alert(`Usuario ${id} eliminado.`);
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
