import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private authService = inject(Auth);
  private router = inject(Router);

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private fb: FormBuilder) {}

  registroForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    empresa: [''],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    terminos: [false, [Validators.requiredTrue]],
  });

  registro(): void {
    if (this.isLoading()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const password = this.registroForm.get('password')?.value ?? '';
    const confirmPassword = this.registroForm.get('confirmPassword')?.value ?? '';

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      first_name: this.registroForm.value.nombre?.trim() ?? '',
      last_name: this.registroForm.value.apellido?.trim() ?? '',
      email: this.registroForm.value.correo?.trim() ?? '',
      phone: this.registroForm.value.telefono?.trim() ?? '',
      empresa: this.registroForm.value.empresa?.trim() ?? '',
      password: password.trim(),
    };

    this.isLoading.set(true);

    this.authService
      .register(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            response?.message ?? 'Cuenta creada correctamente'
          );

          this.registroForm.reset({
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            empresa: '',
            password: '',
            confirmPassword: '',
            terminos: false,
          });

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message ?? 'No se pudo crear la cuenta'
          );
        },
      });
  }
}
