import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLinkWithHref],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

  usuarios = [
    { id: 1, nombre: 'Juan Pérez',    correo: 'juan@tech.com',     rol: 'Cliente',  estado: 'Activo',   fecha: '01 Ene 2026' },
    { id: 2, nombre: 'María López',   correo: 'maria@sol.com',     rol: 'Cliente',  estado: 'Activo',   fecha: '05 Ene 2026' },
    { id: 3, nombre: 'Carlos Vega',   correo: 'carlos@emp.com',    rol: 'Vendedor', estado: 'Activo',   fecha: '10 Ene 2026' },
    { id: 4, nombre: 'Ana Ríos',      correo: 'ana@emp.com',       rol: 'Vendedor', estado: 'Activo',   fecha: '12 Ene 2026' },
    { id: 5, nombre: 'Luis Mamani',   correo: 'luis@andina.com',   rol: 'Cliente',  estado: 'Bloqueado', fecha: '15 Ene 2026' },
    { id: 6, nombre: 'Rosa Quispe',   correo: 'rosa@dig.com',      rol: 'Cliente',  estado: 'Activo',   fecha: '20 Ene 2026' },
    { id: 7, nombre: 'Pedro Flores',  correo: 'pedro@inv.com',     rol: 'Vendedor', estado: 'Bloqueado', fecha: '22 Ene 2026' },
    { id: 8, nombre: 'Admin Sistema', correo: 'admin@empresa.com', rol: 'Admin',    estado: 'Activo',   fecha: '01 Ene 2026' },
  ];

  filtro: string = 'Todos';

  get usuariosFiltrados(){
    if(this.filtro === 'Todos') return this.usuarios;
    return this.usuarios.filter(u => u.rol === this.filtro);
  }

  filtrar(rol: string){
    this.filtro = rol;
  }

  bloquear(usuario: any){
    usuario.estado = usuario.estado === 'Activo' ? 'Bloqueado' : 'Activo';
  }

  eliminar(id: number){
    alert(`Usuario ${id} eliminado.`);
  }
}
