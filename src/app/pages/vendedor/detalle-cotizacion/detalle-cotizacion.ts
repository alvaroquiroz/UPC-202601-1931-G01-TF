import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { Cotizacion, ProductoCotizacion } from '../../../interfaces/cotizacion';

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

  cotizacion = signal<Cotizacion | null>(null);
  productos = signal<ProductoCotizacion[]>([]);

  subtotal = computed(() =>
    this.productos().reduce((acc, p) => acc + p.line_subtotal, 0)
  );
  igv   = computed(() => this.subtotal() * 0.18);
  total = computed(() => this.subtotal() + this.igv());

  async ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id') ?? '1';
    const data = await this.cotService.getCotizacion(Number(id));
    this.cotizacion.set(data.cotizacion);
    this.productos.set(data.productos);
  }

  async aprobar(){
    const cot = this.cotizacion();
    if(!cot) return;
    await this.cotService.aprobar(cot.id);
    this.cotizacion.set({ ...cot, estado: 'Aprobada' });
    alert('Cotización aprobada correctamente.');
  }

  async solicitarCambios(){
    const cot = this.cotizacion();
    if(!cot) return;
    const comentario = prompt('Ingresa el motivo de los cambios:');
    if(!comentario) return;
    await this.cotService.observar(cot.id, comentario);
    this.cotizacion.set({ ...cot, estado: 'Observada' });
    alert('Cambios solicitados correctamente.');
  }

  async rechazar(){
    const cot = this.cotizacion();
    if(!cot) return;
    await this.cotService.rechazar(cot.id);
    this.cotizacion.set({ ...cot, estado: 'Rechazada' });
    alert('Cotización rechazada.');
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
