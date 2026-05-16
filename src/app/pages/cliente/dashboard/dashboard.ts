import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkWithHref],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private cotizacionesService = inject(CotizacionesService);

  cotizaciones = signal<any[]>([]);

  async ngOnInit() {
    const clienteId = 3; 
    try {
      const data = await this.cotizacionesService.getCotizacionesCliente(clienteId);
      this.cotizaciones.set(data);
    } catch (error) {
      console.error("Error al recuperar las cotizaciones recientes en el panel:", error);
    }
  }
  
  get total(){ 
    return this.cotizaciones().length; 
  }
  
  get pendientes(){ 
    return this.cotizaciones().filter(c => c.estado === 'Pendiente').length; 
  }
  
  get aprobadas() { 
    return this.cotizaciones().filter(c => c.estado === 'Aprobada').length; 
  }
  
  get observadas(){ 
    return this.cotizaciones().filter(c => c.estado === 'Observada').length; 
  }
  
  get rechazadas(){ 
    return this.cotizaciones().filter(c => c.estado === 'Rechazada').length; 
  }

  logout(event: Event): void{
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
