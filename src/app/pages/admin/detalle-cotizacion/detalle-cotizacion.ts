import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-detalle-cotizacion',
  imports: [RouterLinkWithHref],
  templateUrl: './detalle-cotizacion.html',
  styleUrl: './detalle-cotizacion.css',
})
export class DetalleCotizacion implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cotService = inject(CotizacionesService);

  cotizacion = signal<any>(null);
  productos = signal<any[]>([]);

  subtotal = computed(() => 
    this.productos().reduce((acc: number, p: any) => acc + (p.line_subtotal || 0), 0)
  );

  igv   = computed(() => this.subtotal() * 0.18);
  total = computed(() => this.subtotal() + this.igv());

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '1';
    console.log('ID capturado:', id);
    try {
      const data = await this.cotService.getCotizacion(Number(id));
      console.log('Data recibida:', data);
      this.cotizacion.set(data.cotizacion);
      this.productos.set(data.productos);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  }
  
  async aprobar() {
    const cot = this.cotizacion();
    if (!cot) return;
    await this.cotService.aprobar(cot.id);
    this.cotizacion.set({ ...cot, estado: 'Aprobada' });
    alert('Cotización aprobada correctamente.');
  }

  async rechazar() {
    const cot = this.cotizacion();
    if (!cot) return;
    await this.cotService.rechazar(cot.id);
    this.cotizacion.set({ ...cot, estado: 'Rechazada' });
    alert('Cotización rechazada.');
  }

  eliminar(){
    alert('Cotización eliminada.');
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
