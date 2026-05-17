import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CotizacionesService } from '../../../core/services/cotizaciones';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLinkWithHref, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private cotService = inject(CotizacionesService);

  cotizaciones = signal<any[]>([]);
  reporteEstados = signal<any[]>([]);
  reporteMeses = signal<any[]>([]);

  async ngOnInit() {
    try {
      const estados = await this.cotService.getReporteEstados();
      this.reporteEstados.set(estados);

      const meses = await this.cotService.getReporteMeses();
      this.reporteMeses.set(meses);

      const cots = await this.cotService.getCotizaciones();
      this.cotizaciones.set(cots);

      this.actualizarGraficas();
    } catch (error) {
      console.error('Error al cargar dashboard admin:', error);
    }
  }

  get total()     { return this.reporteEstados().reduce((acc, e) => acc + e.total, 0); }
  get aprobadas() { return this.reporteEstados().find(e => e.estado === 'Aprobada')?.total || 0; }
  get pendientes(){ return this.reporteEstados().find(e => e.estado === 'Pendiente')?.total || 0; }
  get rechazadas(){ return this.reporteEstados().find(e => e.estado === 'Rechazada')?.total || 0; }
  get observadas() { return this.reporteEstados().find(e => e.estado === 'Observada')?.total || 0; }
  
  actualizarGraficas() {
    const meses = this.reporteMeses();
    this.barChartData = {
      labels: meses.map(m => m.periodo).reverse(),
      datasets: [{
        label: 'Cotizaciones',
        data: meses.map(m => m.total).reverse(),
        backgroundColor: 'rgba(4, 4, 31, 0.8)',
        borderColor: '#04041f',
        borderWidth: 2,
        borderRadius: 8,
      }]
    };

    const estados = this.reporteEstados();
    this.donutChartData = {
      labels: estados.map(e => e.estado),
      datasets: [{
        data: estados.map(e => e.total),
        backgroundColor: ['#16a34a', '#04041f', '#f59e0b', '#e11d48'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    };
  }

  // GRÁFICA DE BARRAS
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Cotizaciones',
      data: [],
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
    labels: [],
    datasets: [{
      data: [],
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
