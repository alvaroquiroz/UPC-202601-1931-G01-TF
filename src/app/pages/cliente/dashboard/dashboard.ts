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
    {id: 'COT-001', fecha: '20-04-2026',total: 'S/. 1,200.00', estado: 'Pendientes'},
    {id: 'COT-002', fecha: '18-04-2026', total: 'S/. 3,750.00', estado: 'Aprobada'},
    {id: 'COT-003', fecha: '15-04-2026', total: 'S/. 890.00', estado: 'Observada'},
    {id: 'COT-004', fecha: '10-04-2026', total: 'S/. 6,200.00', estado: 'Aprobada'},
    {id: 'COT-005', fecha: '05-04-2026', total: 'S/. 450.00', estado: 'Rechazada'},
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
  
  get rechazadas(){ 
    return this.cotizaciones.filter(c => c.estado === 'Rechazada').length; 
  }
}
