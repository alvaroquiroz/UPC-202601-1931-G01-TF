import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css',
})
export class RecuperarPassword {
  constructor(
    private fb: FormBuilder
  ){}

  recuperarForm = this.fb.group({
    correo: ['',[Validators.required, Validators.email]]
  });

  _submit(){
    if(this.recuperarForm.valid){
      console.log(this.recuperarForm.value);
      alert('Se han enviado las instrucciones de recuperación a su correo electrónico.')
    }else{
      alert('Por favor, ingresa un correo válido.')
    }
  }
}
