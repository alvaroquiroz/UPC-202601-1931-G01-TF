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
    id: 'COT-002',
    fecha: '18-04-2026',
    estado: 'Aprobada',
    observaciones: 'Entrega urgente, contactar al cliente para coordinar detalles.',
    cliente:{
      nombre:'Jean Carlo Perez',
      correo:'jeanperez@empresa.com',
      telefono: '978452163',
      empresa: 'AllInTech S.A.C',
    },
    productos: [
      {nombre: 'MACBOOK PRO 16"', cantidad: 1, precio: 4500.00},
      {nombre: 'Monitor Asus 32"', cantidad: 2, precio: 3200.00},
      {nombre: 'Mouse Logitech ProLight 2', cantidad: 4, precio: 1000.00},
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
}
