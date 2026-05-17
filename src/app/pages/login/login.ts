import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  private authService = inject(Auth);

  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private fb: FormBuilder) {}

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');

    if (!token || token === 'undefined' || token === 'null') {
      return;
    }

    try {
      const user = JSON.parse(token);

      if (!user?.role) {
        localStorage.removeItem('access_token');
        return;
      }

      this.redirectByRole(user.role);
    } catch {
      localStorage.removeItem('access_token');
    }
  }

  login(): void {
    if (this.isLoading()) {
      return;
    }

    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload = {
      email: this.loginForm.value.correo?.trim() ?? '',
      password: this.loginForm.value.password?.trim() ?? '',
    };

    this.authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          const user = response?.data;

          if (!user || !user.role) {
            this.errorMessage.set(
              response?.message ?? 'No se pudo iniciar sesión'
            );
            return;
          }

          localStorage.setItem('access_token', JSON.stringify(user));
          this.redirectByRole(user.role);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message ?? 'No se pudo iniciar sesión'
          );
        },
      });
  }

  private redirectByRole(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    if (role === 'vendedor') {
      this.router.navigate(['/vendedor/dashboard']);
      return;
    }

    if (role === 'cliente') {
      this.router.navigate(['/cliente/dashboard']);
      return;
    }

    this.errorMessage.set('Rol no reconocido');
    localStorage.removeItem('access_token');
  }
}
