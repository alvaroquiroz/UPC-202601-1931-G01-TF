import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-detalle-cotizacion',
  imports: [RouterLinkWithHref],
  templateUrl: './detalle-cotizacion.html',
  styleUrl: './detalle-cotizacion.css',
})
export class DetalleCotizacion {

  cotizacion = {
    id: 'COT-001',
    fecha: '20 Abr 2026',
    estado: 'Pendiente',
    observaciones: 'Entrega urgente para el lunes.',
    cliente: {
      nombre: 'Juan Pérez',
      correo: 'juan@empresa.com',
      telefono: '+51 999 999 999',
      empresa: 'Tech SAC'
    },
    vendedor: {
      nombre: 'Carlos Vendedor',
      correo: 'carlos@empresa.com',
    },
    productos: [
      { nombre: 'Laptop Dell XPS 15', cantidad: 1, precio: 4500.00 },
      { nombre: 'Monitor LG 27"',     cantidad: 2, precio: 1200.00 },
      { nombre: 'Mouse Inalámbrico',  cantidad: 3, precio: 180.00  },
    ]
  };

  get subtotal(){
    return this.cotizacion.productos
      .reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  get igv(){ return this.subtotal * 0.18; }
  get total(){ return this.subtotal + this.igv; }

  aprobar(){
    this.cotizacion.estado = 'Aprobada';
    alert('Cotización aprobada correctamente.');
  }

  rechazar(){
    this.cotizacion.estado = 'Rechazada';
    alert('Cotización rechazada.');
  }

  eliminar(){
    alert('Cotización eliminada.');
  }

}
