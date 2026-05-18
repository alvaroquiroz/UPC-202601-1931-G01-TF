import { Component, computed, inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { usuariosService } from '../../../core/services/usuarios';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-nueva-cotizacion-cliente',
  imports: [FormsModule, RouterLinkWithHref],
  templateUrl: './nueva-cotizacion-cliente.html',
  styleUrl: './nueva-cotizacion-cliente.css',
})
export class NuevaCotizacionCliente {
  private router = inject(Router);
  private usuariosService = inject(usuariosService);

  clientes = signal<Usuario[]>([]);
  clienteSeleccionado = signal<Usuario | null>(null);
  busqueda = signal<string>('');

  clientesFiltrados = computed(() => {
    const b = this.busqueda().toLowerCase();
    if(!b) return this.clientes();
    return this.clientes().filter(c =>
      c.first_name.toLowerCase().includes(b) ||
      c.last_name.toLowerCase().includes(b) ||
      c.email.toLowerCase().includes(b)
    );
  });

  async ngOnInit(){
    const data = await this.usuariosService.getUsuarios();
    this.clientes.set(data.filter(u => u.role === 'cliente'));
  }

  seleccionar(cliente: any){
    this.clienteSeleccionado.set(cliente);
  }

  limpiar(){
    this.clienteSeleccionado.set(null);
  }

  crearCotizacion() {
    const cliente = this.clienteSeleccionado();
    if (!cliente) return;
    this.router.navigate(['/vendedor/nueva-cotizacion'], {
        queryParams: { clienteId: cliente.id }
    });
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }

}
