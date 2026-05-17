import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-detalle-cotizacion',
  imports: [RouterLinkWithHref],
  templateUrl: './detalle-cotizacion.html',
  styleUrl: './detalle-cotizacion.css',
})
export class DetalleCotizacion implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cotService = inject(CotizacionesService);
  
  cotizacion = signal<any>(null);
  usuarioActual: any = {};

  async ngOnInit() {
    this.usuarioActual = JSON.parse(localStorage.getItem('access_token') || '{}');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const response = await this.cotService.getCotizacionCliente(id);
        const dataUnwrapped = response.data ? response.data : response;
        
        this.cotizacion.set(dataUnwrapped);
      } catch (error) {
        console.error("Error al recuperar el detalle de la cotización:", error);
      }
    }
  }
  
  get subtotal(){
    const cot = this.cotizacion();
    if (!cot || !cot.productos) return 0;
    return cot.productos.reduce((acc: number, p: any) => {
      const precio = p.precio || p.unit_price || 0;
      const cantidad = p.cantidad || p.quantity || 0;
      return acc + (precio * cantidad);
    }, 0);
  }

  get igv(){ 
    return this.subtotal * 0.18; 
  }
  
  get total(){ 
    return this.subtotal + this.igv; 
  }

  logout(event: Event): void{
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}