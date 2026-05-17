import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ProductosService } from '../../../core/services/productos';
import { Producto } from '../../../interfaces/producto';

@Component({
  selector: 'app-catalogo',
  imports: [RouterLinkWithHref],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private router = inject(Router);
  private productosService = inject(ProductosService);

  productos = signal<Producto[]>([]);

  async ngOnInit() {
    try {
      const data = await this.productosService.getProductos();
      this.productos.set(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
