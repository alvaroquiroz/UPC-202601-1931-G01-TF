import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-nueva-cotizacion-cliente',
  imports: [FormsModule, RouterLinkWithHref],
  templateUrl: './nueva-cotizacion-cliente.html',
  styleUrl: './nueva-cotizacion-cliente.css',
})
export class NuevaCotizacionCliente {
  private router = inject(Router);

  clientes = [
    { id: 1, nombre: 'Juan Pérez',   empresa: 'Tech SAC',       correo: 'juan@tech.com',   telefono: '+51 999 111 222', cotizaciones: 5  },
    { id: 2, nombre: 'María López',  empresa: 'Soluciones SRL', correo: 'maria@sol.com',   telefono: '+51 999 333 444', cotizaciones: 3  },
    { id: 3, nombre: 'Carlos Ruiz',  empresa: 'Grupo Norte',    correo: 'carlos@gn.com',   telefono: '+51 999 555 666', cotizaciones: 8  },
    { id: 4, nombre: 'Ana Torres',   empresa: 'Importex EIRL',  correo: 'ana@imp.com',     telefono: '+51 999 777 888', cotizaciones: 2  },
    { id: 5, nombre: 'Luis Mamani',  empresa: 'Andina Corp',    correo: 'luis@andina.com', telefono: '+51 999 999 000', cotizaciones: 11 },
    { id: 6, nombre: 'Rosa Quispe',  empresa: 'Digital SAC',    correo: 'rosa@dig.com',    telefono: '+51 999 112 233', cotizaciones: 4  },
  ];

  clienteSeleccionado: any = null;
  busqueda: string = '';

  get clientesFiltrados(){
    if(!this.busqueda) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      c.empresa.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  seleccionar(cliente: any){
    this.clienteSeleccionado = cliente;
  }

  limpiar(){
    this.clienteSeleccionado = null;
  }

  logout(event: Event): void {
  event.preventDefault();
  localStorage.removeItem('access_token');
  this.router.navigate(['/']);
  }

}
