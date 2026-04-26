import { Component } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkWithHref, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    private router: Router
  ) {}

  cotizaciones = [
    { id: 'COT-001', cliente: 'Juan Pérez',  fecha: '20 Abr 2026', total: 'S/. 1,200.00', estado: 'Pendiente' },
    { id: 'COT-002', cliente: 'María López', fecha: '18 Abr 2026', total: 'S/. 3,750.00', estado: 'Aprobada'  },
    { id: 'COT-003', cliente: 'Carlos Ruiz', fecha: '15 Abr 2026', total: 'S/. 890.00',   estado: 'Observada' },
    { id: 'COT-004', cliente: 'Ana Torres',  fecha: '10 Abr 2026', total: 'S/. 6,200.00', estado: 'Aprobada'  },
    { id: 'COT-005', cliente: 'Luis Mamani', fecha: '05 Abr 2026', total: 'S/. 450.00',   estado: 'Rechazada' },
  ];

  get total()     { return this.cotizaciones.length; }
  get pendientes(){ return this.cotizaciones.filter(c => c.estado === 'Pendiente').length; }
  get aprobadas() { return this.cotizaciones.filter(c => c.estado === 'Aprobada').length; }
  get rechazadas(){ return this.cotizaciones.filter(c => c.estado === 'Rechazada').length; }

  // GRÁFICA DE BARRAS
  barChartData: ChartData<'bar'> = {
    labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
    datasets: [{
      label: 'Cotizaciones',
      data: [68, 92, 75, 110, 98, 124],
      backgroundColor: 'rgba(4, 4, 31, 0.8)',
      borderColor: '#04041f',
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#e5e7ef' } },
      y: { grid: { color: '#e5e7ef' } }
    }
  };

  // GRÁFICA DE DONA
  donutChartData: ChartData<'doughnut'> = {
    labels: ['Aprobadas', 'Pendientes', 'Observadas', 'Rechazadas'],
    datasets: [{
      data: [89, 25, 10, 10],
      backgroundColor: ['#16a34a', '#04041f', '#f59e0b', '#e11d48'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, font: { size: 12 } }
      }
    }
  };

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
