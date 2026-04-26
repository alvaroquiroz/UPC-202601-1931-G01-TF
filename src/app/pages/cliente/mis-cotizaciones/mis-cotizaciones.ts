import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-mis-cotizaciones',
  imports: [RouterLinkWithHref],
  templateUrl: './mis-cotizaciones.html',
  styleUrl: './mis-cotizaciones.css',
})
export class MisCotizaciones {

  cotizaciones = [
    {id: 'COT-001', fecha: '20-04-2026', productos: 3, total: 'S/. 1,200.00', estado: 'Pendiente'},
    {id: 'COT-002', fecha: '18-04-2026', productos: 5, total: 'S/. 3,750.00', estado: 'Aprobada'},
    {id: 'COT-003', fecha: '15-04-2026', productos: 2, total: 'S/. 890.00', estado: 'Observada'},
    {id: 'COT-004', fecha: '10-04-2026', productos: 7, total: 'S/. 6,200.00', estado: 'Aprobada'},
    {id: 'COT-005', fecha: '05-04-2026', productos: 1, total: 'S/. 450.00', estado: 'Rechazada'},
  ];
}
