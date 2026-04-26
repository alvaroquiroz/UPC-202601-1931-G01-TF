import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';

import { Dashboard as AdminDashboard } from './pages/admin/dashboard/dashboard';
import { Cotizaciones as AdminCotizaciones } from './pages/admin/cotizaciones/cotizaciones';
import { DetalleCotizacion as AdminDetalle } from './pages/admin/detalle-cotizacion/detalle-cotizacion';
import { EditarUsuario } from './pages/admin/editar-usuario/editar-usuario';
import { Reportes } from './pages/admin/reportes/reportes';
import { Usuarios } from './pages/admin/usuarios/usuarios';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    { path: '', component: Login},
    { path: 'registro', component: Registro},
    { path: 'recuperar-password', component: RecuperarPassword},

    {
    path: 'admin',
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: AdminDashboard },
        { path: 'cotizaciones', component: AdminCotizaciones },
        { path: 'detalle-cotizacion', component: AdminDetalle },
        { path: 'editar-usuario', component: EditarUsuario },
        { path: 'reportes', component: Reportes },
        { path: 'usuarios', component: Usuarios },
      ]
    },

    { path: '**', redirectTo: '' }
];
