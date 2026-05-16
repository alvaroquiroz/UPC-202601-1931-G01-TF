import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ProductosService } from '../../../core/services/productos';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { Producto } from '../../../interfaces/producto';

@Component({
  selector: 'app-solicitar-cotizacion',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './solicitar-cotizacion.html',
  styleUrl: './solicitar-cotizacion.css',
})
export class SolicitarCotizacion implements OnInit {
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private cotizacionesService = inject(CotizacionesService);
  private fb = inject(FormBuilder);
  
  cotizacionForm: FormGroup;
  productos = signal<Producto[]>([]);
  carrito: { id: number, nombre: string, precio: number, cantidad: number }[] = [];

  constructor(){
    this.cotizacionForm = this.fb.group({
      observaciones: ['']
    });
  }
  
  async ngOnInit() {
    try {
      const data = await this.productosService.getProductos();
      this.productos.set(data);
    } catch (error) {
      console.error("Error al cargar productos desde el contenedor:", error);
    }
  }

  agregarProducto(producto: any){
    const existe = this.carrito.find(p => p.id === producto.id);
    if(existe){
      existe.cantidad++;
    } else {
      this.carrito.push({ 
        id: producto.id, 
        nombre: producto.nombre, 
        precio: producto.precio, 
        cantidad: 1 
      });
    }
  }

  quitarProducto(id: number){
    this.carrito = this.carrito.filter(p => p.id !== id);
  }

  reducirProducto(id: number){
    const item = this.carrito.find(p => p.id === id);
    if(item){
      if(item.cantidad > 1){
        item.cantidad--;
      } else {
        this.carrito = this.carrito.filter(p => p.id !== id);
      }
    }
  }

  get total(){
    return this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2);
  }

  async _submit(){
    if(this.carrito.length === 0){
      alert('Agrega al menos un producto a la cotización.');
      return;
    }

    const subtotal = this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    const clienteId = 3; 
    const payload = {
      clienteId: clienteId,
      observaciones: this.cotizacionForm.value.observaciones,
      subtotal: subtotal,
      igv: igv,
      total: total,
      productos: this.carrito
    };

    try {
      await this.cotizacionesService.crearCotizacion(payload);
      alert('Cotización enviada correctamente.');
      this.router.navigate(['/cliente/mis-cotizaciones']);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar la cotización.');
    }
  }

  logout(event: Event): void{
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

}
