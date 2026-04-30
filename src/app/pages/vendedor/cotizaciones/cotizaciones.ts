import { Component, inject } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-cotizaciones',
  imports: [RouterLinkWithHref],
  templateUrl: './cotizaciones.html',
  styleUrl: './cotizaciones.css',
})
export class Cotizaciones {
    private router = inject(Router);

    cotizaciones = [
      { id: 'COT-001', cliente: 'Juan Pérez',   empresa: 'Tech SAC',      fecha: '20 Abr 2026', total: 'S/. 1,200.00', estado: 'Pendiente' },
      { id: 'COT-002', cliente: 'María López',  empresa: 'Soluciones SRL', fecha: '18 Abr 2026', total: 'S/. 3,750.00', estado: 'Aprobada'  },
      { id: 'COT-003', cliente: 'Carlos Ruiz',  empresa: 'Grupo Norte',    fecha: '15 Abr 2026', total: 'S/. 890.00',   estado: 'Observada' },
      { id: 'COT-004', cliente: 'Ana Torres',   empresa: 'Importex EIRL',  fecha: '10 Abr 2026', total: 'S/. 6,200.00', estado: 'Aprobada'  },
      { id: 'COT-005', cliente: 'Luis Mamani',  empresa: 'Andina Corp',    fecha: '05 Abr 2026', total: 'S/. 450.00',   estado: 'Rechazada' },
      { id: 'COT-006', cliente: 'Rosa Quispe',  empresa: 'Digital SAC',    fecha: '02 Abr 2026', total: 'S/. 2,100.00', estado: 'Pendiente' },
      { id: 'COT-007', cliente: 'Pedro Flores', empresa: 'Inversiones JL', fecha: '01 Abr 2026', total: 'S/. 980.00',   estado: 'Aprobada'  },
    ];

    filtro: string = 'Todos';

  get cotizacionesFiltradas(){
    if(this.filtro === 'Todos') 
      return this.cotizaciones;
      return this.cotizaciones.filter(c => c.estado === this.filtro);
  }

  filtrar(estado: string){
    this.filtro = estado;
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
