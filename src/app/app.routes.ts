import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';

export const routes: Routes = [

    { path: '', component: Login},
    { path: 'registro', component: Registro},
    { path: 'recuperar-password', component: RecuperarPassword},

    { path: '**', redirectTo: '' }
];
