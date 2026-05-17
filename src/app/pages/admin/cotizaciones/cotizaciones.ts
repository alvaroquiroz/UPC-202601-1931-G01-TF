import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-cotizaciones',
  imports: [RouterLinkWithHref],
  templateUrl: './cotizaciones.html',
  styleUrl: './cotizaciones.css',
})
export class Cotizaciones {
  private router = inject(Router);
  private cotService = inject(CotizacionesService);

  cotizaciones = signal<any>([]);

  filtro = signal<string>('Todos');

  cotizacionesFiltradas = computed(() => {
    if(this.filtro() === 'Todos') return this.cotizaciones();
    return this.cotizaciones().filter((c:any) => c.estado === this.filtro());
  });

  async ngOnInit() {
    try {
      const data = await this.cotService.getCotizacionesAdmin();
      this.cotizaciones.set(data);
    } catch (error) {
      console.error('Error al cargar cotizaciones admin:', error);
    }
  }

  filtrar(estado: string){
    this.filtro.set(estado);
  }

  eliminar(id: string){
    alert(`Cotización ${id} eliminada.`);
  }

  logout(event: Event){
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
