import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reportes',
  imports: [RouterLinkWithHref, BaseChartDirective],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {

  resumen = [
    { label: 'Total Cotizaciones', valor: 124, icono: 'bi-file-earmark-text' },
    { label: 'Monto Total',        valor: 'S/. 89,450', icono: 'bi-cash-stack' },
    { label: 'Tasa de Aprobación', valor: '71.7%',      icono: 'bi-check-circle' },
    { label: 'Promedio por Cot.',  valor: 'S/. 721',    icono: 'bi-graph-up' },
  ];

  // GRÁFICA DE BARRAS — ventas por mes
  barChartData: ChartData<'bar'> = {
    labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
    datasets: [
      {
        label: 'Aprobadas',
        data: [48, 65, 52, 78, 70, 89],
        backgroundColor: 'rgba(22, 163, 74, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Rechazadas',
        data: [10, 15, 12, 18, 16, 10],
        backgroundColor: 'rgba(225, 29, 72, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { grid: { color: '#e5e7ef' } },
      y: { grid: { color: '#e5e7ef' } }
    }
  };

  // GRÁFICA DE LÍNEA — monto por mes
  lineChartData: ChartData<'line'> = {
    labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
    datasets: [{
      label: 'Monto (S/.)',
      data: [12000, 18500, 14200, 22000, 19800, 25400],
      borderColor: '#04041f',
      backgroundColor: 'rgba(4, 4, 31, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
    }]
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#e5e7ef' } },
      y: { grid: { color: '#e5e7ef' } }
    }
  };

  // GRÁFICA DE DONA — por vendedor
  donutChartData: ChartData<'doughnut'> = {
    labels: ['Carlos Vega', 'Ana Ríos', 'Luis M.'],
    datasets: [{
      data: [45, 38, 41],
      backgroundColor: ['#04041f', '#16a34a', '#f59e0b'],
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

  // TABLA TOP CLIENTES
  topClientes = [
    { nombre: 'Ana Torres',   empresa: 'Importex EIRL',  cotizaciones: 12, total: 'S/. 24,600' },
    { nombre: 'Luis Mamani',  empresa: 'Andina Corp',    cotizaciones: 11, total: 'S/. 18,900' },
    { nombre: 'Juan Pérez',   empresa: 'Tech SAC',       cotizaciones: 8,  total: 'S/. 15,200' },
    { nombre: 'Rosa Quispe',  empresa: 'Digital SAC',    cotizaciones: 7,  total: 'S/. 12,400' },
    { nombre: 'María López',  empresa: 'Soluciones SRL', cotizaciones: 5,  total: 'S/. 9,800'  },
  ];
}
