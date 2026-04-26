import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkWithHref, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  errorMessage: string = '';
  private router = inject(Router);

  constructor(
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');

    if (token) {
      const user = JSON.parse(token);

      if (user.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
        return;
      }

      if (user.role === 'vendedor') {
        this.router.navigate(['/vendedor/dashboard']);
        return;
      }

      if (user.role === 'cliente') {
        this.router.navigate(['/cliente/dashboard']);
        return;
      }
    }
  }

  loginForm = this.fb.group({
    correo:   ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login(): void {
  this.errorMessage = '';
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const email = this.loginForm.value.correo?.trim() ?? '';
  const password = this.loginForm.value.password?.trim() ?? '';

  if (email === 'admin@cotizaciones.com' && password === 'admin123') {
    localStorage.setItem('access_token', JSON.stringify({
      email,
      role: 'admin',
      name: 'Carlos Administrador'
    }));
    this.router.navigate(['/admin/dashboard']);
    return;
  }

  if (email === 'vendedor@cotizaciones.com' && password === 'vendedor123') {
    localStorage.setItem('access_token', JSON.stringify({
      email,
      role: 'vendedor',
      name: 'María Vendedora'
    }));
    this.router.navigate(['/vendedor/dashboard']);
    return;
  }

  if (email === 'cliente@empresa.com' && password === 'cliente123') {
    localStorage.setItem('access_token', JSON.stringify({
      email,
      role: 'cliente',
      name: 'Juan Cliente'
    }));
    this.router.navigate(['/cliente/dashboard']);
    return;
  }

  this.errorMessage = 'Credenciales incorrectas';
}
}
