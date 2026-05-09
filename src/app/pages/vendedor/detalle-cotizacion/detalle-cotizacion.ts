import { Component, inject } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-detalle-cotizacion',
  imports: [RouterLinkWithHref],
  templateUrl: './detalle-cotizacion.html',
  styleUrl: './detalle-cotizacion.css',
})
export class DetalleCotizacion {

  private router = inject(Router);

  cotizacion = {
    id: 'COT-001',
    fecha: '20-04-2026',
    estado: 'Pendiente',
    observaciones: 'Entrega urgente para el lunes.',
    cliente: {
      nombre: 'Juan Pérez',
      correo: 'juan@empresa.com',
      telefono: '+51 999 999 999',
      empresa: 'Tech SAC'
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

  get igv(){ 
    return this.subtotal * 0.18; 
  }
  
  get total(){ 
    return this.subtotal + this.igv; 
  }

  aprobar(){
    this.cotizacion.estado = 'Aprobada';
    alert('Cotización aprobada correctamente.');
  }

  solicitarCambios(){
    this.cotizacion.estado = 'Observada';
    alert('Se solicitaron cambios al cliente.');
  }

  rechazar(){
    this.cotizacion.estado = 'Rechazada';
    alert('Cotización rechazada.');
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
