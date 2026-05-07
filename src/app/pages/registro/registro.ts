import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  constructor(
    private fb: FormBuilder
  ){}

  registroForm = this.fb.group({
    nombre: ['',[Validators.required]],
    apellido:['',[Validators.required]],
    correo:['',[Validators.required, Validators.email]],
    telefono:['',[Validators.required]],
    empresa:[''],
    password:['',[Validators.required]],
    confirmPassword:['',[Validators.required]],
    terminos:[false,[Validators.requiredTrue]]
  })

  _submit(){
    const password = this.registroForm.get('password')?.value;
    const confirmPassword = this.registroForm.get('confirmPassword')?.value;

    if(password !== confirmPassword){
      alert('Las contraseñas no coinciden.');
      return;
    }
    
    if(this.registroForm.valid){
      console.log(this.registroForm.value);
    }else{
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}
