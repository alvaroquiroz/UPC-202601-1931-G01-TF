import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkWithHref],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cotizaciones = [
    { id: 'COT-001', cliente: 'Juan Pérez',    fecha: '20 Abr 2026', total: 'S/. 1,200.00', estado: 'Pendiente' },
    { id: 'COT-002', cliente: 'María López',   fecha: '18 Abr 2026', total: 'S/. 3,750.00', estado: 'Aprobada'  },
    { id: 'COT-003', cliente: 'Carlos Ruiz',   fecha: '15 Abr 2026', total: 'S/. 890.00',   estado: 'Observada' },
    { id: 'COT-004', cliente: 'Ana Torres',    fecha: '10 Abr 2026', total: 'S/. 6,200.00', estado: 'Aprobada'  },
    { id: 'COT-005', cliente: 'Luis Mamani',   fecha: '05 Abr 2026', total: 'S/. 450.00',   estado: 'Rechazada' },
  ];

  get total(){ 
    return this.cotizaciones.length;
  }

  get pendientes(){ 
    return this.cotizaciones.filter(c => c.estado === 'Pendiente').length; 
  }

  get aprobadas() { 
    return this.cotizaciones.filter(c => c.estado === 'Aprobada').length; 
  }

  get observadas(){ 
    return this.cotizaciones.filter(c => c.estado === 'Observada').length; 
  }
}
