import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-editar-usuario',
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario {

  editarForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.editarForm = this.fb.group({
      nombre:   ['Juan Pérez',        [Validators.required]],
      correo:   ['juan@tech.com',     [Validators.required, Validators.email]],
      telefono: ['+51 999 111 222',   []],
      empresa:  ['Tech SAC',          []],
      rol:      ['Cliente',           [Validators.required]],
      estado:   ['Activo',            [Validators.required]],
    });
  }

  _submit(){
    if(this.editarForm.valid){
      console.log(this.editarForm.value);
      alert('Usuario actualizado correctamente.');
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}
