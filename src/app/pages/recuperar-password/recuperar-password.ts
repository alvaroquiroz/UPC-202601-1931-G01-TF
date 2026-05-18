import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-recuperar-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css',
})
export class RecuperarPassword {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  errorMessage = signal('');
  successMessage = signal('');
  resetUrl = signal('');
  isLoading = signal(false);

  recuperarForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  enviar(): void {
    if (this.isLoading()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.resetUrl.set('');

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword({
      email: this.recuperarForm.value.correo?.trim() ?? '',
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (response) => {
        this.successMessage.set(
          response?.message ?? 'Solicitud procesada correctamente'
        );

        this.resetUrl.set(response?.data?.reset_url ?? '');
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message ?? 'No se pudo procesar la solicitud'
        );
      },
    });
  }
}
