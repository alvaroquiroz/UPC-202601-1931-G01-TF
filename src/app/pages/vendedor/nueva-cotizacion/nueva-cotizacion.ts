import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-nueva-cotizacion',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './nueva-cotizacion.html',
  styleUrl: './nueva-cotizacion.css',
})
export class NuevaCotizacion {

  cotizacionForm: FormGroup;

  productos = [
    { id: 1, nombre: 'Laptop Dell XPS 15',  precio: 4500.00, descripcion: 'Laptop profesional 15"' },
    { id: 2, nombre: 'Monitor LG 27"',       precio: 1200.00, descripcion: 'Monitor 4K IPS' },
    { id: 3, nombre: 'Teclado Mecánico',     precio: 350.00,  descripcion: 'Teclado mecánico RGB' },
    { id: 4, nombre: 'Mouse Inalámbrico',    precio: 180.00,  descripcion: 'Mouse ergonómico' },
    { id: 5, nombre: 'Auriculares Sony',     precio: 650.00,  descripcion: 'Auriculares noise cancelling' },
    { id: 6, nombre: 'Webcam Logitech',      precio: 420.00,  descripcion: 'Webcam 4K' },
  ];

  carrito: { id: number, nombre: string, precio: number, cantidad: number }[] = [];

  constructor(private fb: FormBuilder){
    this.cotizacionForm = this.fb.group({
      cliente:       ['', [Validators.required]],
      empresa:       ['', [Validators.required]],
      correo:        ['', [Validators.required, Validators.email]],
      observaciones: ['']
    });
  }

  agregarProducto(producto: any){
    const existe = this.carrito.find(p => p.id === producto.id);
    if(existe){
      existe.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  quitarProducto(id: number){
    this.carrito = this.carrito.filter(p => p.id !== id);
  }

  get subtotal(){
    return this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  get igv(){ 
    return this.subtotal * 0.18; 
  }
  
  get total(){ 
    return this.subtotal + this.igv; 
  }

  _submit(){
    if(this.cotizacionForm.invalid){
      alert('Por favor, complete los datos del cliente.');
      return;
    }
    if(this.carrito.length === 0){
      alert('Agrega al menos un producto a la cotización.');
      return;
    }
    console.log({ ...this.cotizacionForm.value, productos: this.carrito });
    alert('Cotización creada correctamente.');
  }

}
