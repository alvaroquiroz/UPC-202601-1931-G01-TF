import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ProductosService } from '../../../core/services/productos';
import { Producto } from '../../../interfaces/producto';

@Component({
  selector: 'app-nueva-cotizacion',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './nueva-cotizacion.html',
  styleUrl: './nueva-cotizacion.css',
})
export class NuevaCotizacion {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);

  cotizacionForm: FormGroup = this.fb.group({
    cliente:       ['', [Validators.required]],
    empresa:       ['', [Validators.required]],
    correo:        ['', [Validators.required, Validators.email]],
    observaciones: ['']
  });

  productos = signal<Producto[]>([]);
  carrito = signal<{ id: number, name: string, unit_price: number, cantidad: number }[]>([]);

  subtotal = computed(() =>
    this.carrito().reduce((acc, p) => acc + p.unit_price * p.cantidad, 0)
  );
  igv   = computed(() => this.subtotal() * 0.18);
  total = computed(() => this.subtotal() + this.igv());

  async ngOnInit(){
    const data = await this.productosService.getProductos();
    this.productos.set(data);
  }

  agregarProducto(producto: any){
    const lista  = this.carrito();
    const existe = lista.find(p => p.id === producto.id);
    if(existe){
      this.carrito.set(lista.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      this.carrito.set([...lista, {
        id:         producto.id,
        name:       producto.name,
        unit_price: producto.unit_price,
        cantidad:   1
      }]);
    }
  }

  reducirProducto(id: number){
    const lista = this.carrito();
    const item  = lista.find(p => p.id === id);
    if(!item) return;
    if(item.cantidad > 1){
      this.carrito.set(lista.map(p =>
        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
      ));
    } else {
      this.carrito.set(lista.filter(p => p.id !== id));
    }
  }

  quitarProducto(id: number){
    this.carrito.set(this.carrito().filter(p => p.id !== id));
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

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
