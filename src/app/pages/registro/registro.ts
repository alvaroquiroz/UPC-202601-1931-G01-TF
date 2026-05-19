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
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  submitted = signal(false);

  constructor(private fb: FormBuilder) {}

  registroForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    empresa: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    terminos: [false, [Validators.requiredTrue]],
  });

  registro(): void {
    this.submitted.set(true);

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
      accepted_terms: this.registroForm.value.terminos ?? false,
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

          this.submitted.set(false);

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

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }
}
