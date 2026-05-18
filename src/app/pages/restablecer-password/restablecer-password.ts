import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-restablecer-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-password.html',
  styleUrl: './restablecer-password.css',
})
export class RestablecerPassword {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  token = this.route.snapshot.paramMap.get('token') ?? '';

  form = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  guardar(): void {
    if (this.isLoading()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.token) {
      this.errorMessage.set('El enlace no es válido');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.value.password?.trim() ?? '';
    const confirmPassword = this.form.value.confirmPassword?.trim() ?? '';

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .resetPassword({
        token: this.token,
        password,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            response?.message ?? 'La contraseña fue actualizada correctamente'
          );

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message ?? 'No se pudo restablecer la contraseña'
          );
        },
      });
  }
}
