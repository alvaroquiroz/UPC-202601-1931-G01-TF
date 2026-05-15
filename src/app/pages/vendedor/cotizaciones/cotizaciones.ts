import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { Cotizacion } from '../../../interfaces/cotizacion';

@Component({
  selector: 'app-cotizaciones',
  imports: [RouterLinkWithHref],
  templateUrl: './cotizaciones.html',
  styleUrl: './cotizaciones.css',
})
export class Cotizaciones {
  private router = inject(Router);
  private cotService = inject(CotizacionesService);

  cotizaciones = signal<Cotizacion[]>([]);
  filtro = signal<string>('Todos');

  cotizacionesFiltradas = computed(() => {
    if(this.filtro() === 'Todos') return this.cotizaciones();
    return this.cotizaciones().filter(c => c.estado === this.filtro());
  });
  
  async ngOnInit(){
    const data = await this.cotService.getCotizaciones();
    this.cotizaciones.set(data);
  }

  filtrar(estado: string){
    this.filtro.set(estado);
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
