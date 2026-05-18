import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { CotizacionesService } from '../../../core/services/cotizaciones';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-editar-usuario',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cotService = inject(CotizacionesService);

  editarForm: FormGroup;
  usuarioId = signal<number>(0);

  constructor(private fb: FormBuilder){
    this.editarForm = this.fb.group({
      first_name:   ['',  [Validators.required]],
      last_name:    ['',  [Validators.required]],
      email:        ['',  [Validators.required, Validators.email]],
      phone:        ['',  []],
      empresa:      ['',  []],
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId.set(Number(id));
      try {
        const data = await this.cotService.getUsuarios();
        const usuario = data.find((u: any) => u.id === Number(id));
        if (usuario) {
          this.editarForm.patchValue({
            first_name: usuario.first_name,
            last_name:  usuario.last_name,
            email:      usuario.email,
            phone:      usuario.phone,
            empresa:    usuario.empresa,
          });
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
  }

  async _submit() {
    if (this.editarForm.invalid) {
      alert('Por favor complete todos los campos correctamente.');
      return;
    }
    try {
      await this.cotService.editarUsuario(this.usuarioId(), this.editarForm.value);
      alert('Usuario actualizado correctamente.');
      this.router.navigate(['/admin/usuarios']);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Hubo un error al actualizar el usuario.');
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
