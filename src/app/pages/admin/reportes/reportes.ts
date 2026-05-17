import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reportes',
  imports: [RouterLinkWithHref, BaseChartDirective, DecimalPipe],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit{
  private router = inject(Router);
  private cotService = inject(CotizacionesService);

  topClientes      = signal<any[]>([]);
  reporteEstados   = signal<any[]>([]);
  reporteMeses     = signal<any[]>([]);
  reporteVendedores = signal<any[]>([]);

  totalCotizaciones = signal<number>(0);
  montoTotal = signal<number>(0);
  tasaAprobacion = signal<string>('0%');
  promedioPorCot = signal<string>('S/. 0');;

  async ngOnInit() {
    try {
      const estados = await this.cotService.getReporteEstados();
      this.reporteEstados.set(estados);

      const meses = await this.cotService.getReporteMeses();
      this.reporteMeses.set(meses);

      const clientes = await this.cotService.getRankingClientes();
      this.topClientes.set(clientes);

      const vendedores = await this.cotService.getReporteVendedores();
      this.reporteVendedores.set(vendedores);

      this.calcularResumen();
      this.actualizarGraficas();
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  }

  calcularResumen() {
    const estados = this.reporteEstados();
    const total = estados.reduce((acc, e) => acc + e.total, 0);
    const monto = estados.reduce((acc, e) => acc + e.monto_total, 0);
    const aprobadas = estados.find(e => e.estado === 'Aprobada')?.total || 0;
    const tasa = total > 0 ? ((aprobadas / total) * 100).toFixed(1) + '%' : '0%';
    const promedio = total > 0 ? 'S/. ' + (monto / total).toFixed(0) : 'S/. 0';

    this.totalCotizaciones.set(total);
    this.montoTotal.set(monto);
    this.tasaAprobacion.set(tasa);
    this.promedioPorCot.set(promedio);
  }

  actualizarGraficas() {
    const meses = this.reporteMeses().slice().reverse();
    this.barChartData = {
      labels: meses.map(m => m.periodo),
      datasets: [
        {
          label: 'Cotizaciones',
          data: meses.map(m => m.total),
          backgroundColor: 'rgba(22, 163, 74, 0.8)',
          borderRadius: 8,
        }
      ]
    };

  this.lineChartData = {
      labels: meses.map(m => m.periodo),
      datasets: [{
        label: 'Monto (S/.)',
        data: meses.map(m => m.monto_total),
        borderColor: '#04041f',
        backgroundColor: 'rgba(4, 4, 31, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
      }]
    };

    const vendedores = this.reporteVendedores();
    this.donutChartData = {
      labels: vendedores.map(v => v.vendedor),
      datasets: [{
        data: vendedores.map(v => v.total_cotizaciones),
        backgroundColor: ['#04041f', '#16a34a', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    };
  }

  // GRÁFICA DE BARRAS — ventas por mes
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { grid: { color: '#e5e7ef' } },
      y: { grid: { color: '#e5e7ef' } }
    }
  };

  // GRÁFICA DE LÍNEA — monto por mes
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#e5e7ef' } },
      y: { grid: { color: '#e5e7ef' } }
    }
  };

  // GRÁFICA DE DONA — por vendedor
  donutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
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
