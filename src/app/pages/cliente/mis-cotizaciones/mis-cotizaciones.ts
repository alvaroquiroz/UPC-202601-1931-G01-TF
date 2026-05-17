import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-mis-cotizaciones',
  imports: [RouterLinkWithHref],
  templateUrl: './mis-cotizaciones.html',
  styleUrl: './mis-cotizaciones.css',
})
export class MisCotizaciones implements OnInit {
  private router = inject(Router);
  private cotizacionesService = inject(CotizacionesService);
  
  cotizaciones = signal<any[]>([]);
  usuarioActual: any = {};

  async ngOnInit() {
    this.usuarioActual = JSON.parse(localStorage.getItem('access_token') || '{}');
    const clienteId = this.usuarioActual?.id || 4;
    
    try {
      const data = await this.cotizacionesService.getCotizacionesCliente(clienteId);
      this.cotizaciones.set(data);
    } catch (error) {
      console.error("Error al cargar cotizaciones", error);
    }
  }

  logout(event: Event): void{
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}