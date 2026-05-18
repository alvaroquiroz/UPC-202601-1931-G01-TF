import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { ProductosService } from '../../../core/services/productos';
import { Producto } from '../../../interfaces/producto';
import { UsuariosService } from '../../../core/services/usuarios';
import { CotizacionesService } from '../../../core/services/cotizaciones';

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
  private route = inject(ActivatedRoute);
  private cotizacionesService = inject(CotizacionesService);
  private usuariosService = inject(UsuariosService);

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

  async ngOnInit() {
    const clienteId = this.route.snapshot.queryParamMap.get('clienteId');
    if (!clienteId) {
        this.router.navigate(['/vendedor/nueva-cotizacion-cliente']);
        return;
    }

    const data = await this.productosService.getProductos();
    this.productos.set(data);

    const usuarios = await this.usuariosService.getUsuarios();
    const cliente = usuarios.find((u: any) => u.id === Number(clienteId));
    if (cliente) {
        this.cotizacionForm.patchValue({
            cliente: `${cliente.first_name} ${cliente.last_name}`,
            empresa: cliente.empresa || '',
            correo:  cliente.email
        });
    }
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

  async _submit() {
    if (this.cotizacionForm.invalid) {
      this.cotizacionForm.markAllAsTouched();
      alert('Por favor, complete los datos del cliente.');
      return;
    }
    if (this.carrito().length === 0) {
      alert('Agrega al menos un producto a la cotización.');
      return;
    }

    const clienteId = this.route.snapshot.queryParamMap.get('clienteId');
    if (!clienteId) {
      alert('No se pudo identificar al cliente. Vuelve a seleccionarlo.');
      return;
    }

    const payload = {
      clienteId:     Number(clienteId),
      observaciones: this.cotizacionForm.value.observaciones,
      subtotal:      this.subtotal(),
      igv:           this.igv(),
      total:         this.total(),
      productos:     this.carrito().map(p => ({
        id:       p.id,
        nombre:   p.name,
        precio:   p.unit_price,
        cantidad: p.cantidad
      }))
    };

    try {
      await this.cotizacionesService.crearCotizacion(payload);
      alert('Cotización creada correctamente.');
      this.router.navigate(['/vendedor/cotizaciones']);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear la cotización.');
    }
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }
}
