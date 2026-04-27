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

import { Dashboard as ClienteDashboard } from './pages/cliente/dashboard/dashboard';
import { DetalleCotizacion as ClienteDetalle } from './pages/cliente/detalle-cotizacion/detalle-cotizacion';
import { MisCotizaciones } from './pages/cliente/mis-cotizaciones/mis-cotizaciones';
import { SolicitarCotizacion } from './pages/cliente/solicitar-cotizacion/solicitar-cotizacion';

import { Dashboard as VendedorDashboard } from './pages/vendedor/dashboard/dashboard';
import { Cotizaciones as VendedorCotizaciones } from './pages/vendedor/cotizaciones/cotizaciones';
import { DetalleCotizacion as VendedorDetalle } from './pages/vendedor/detalle-cotizacion/detalle-cotizacion';
import { NuevaCotizacion } from './pages/vendedor/nueva-cotizacion/nueva-cotizacion';
import { NuevaCotizacionCliente } from './pages/vendedor/nueva-cotizacion-cliente/nueva-cotizacion-cliente';
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

    {
      path: 'cliente',
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: ClienteDashboard },
        { path: 'detalle-cotizacion', component: ClienteDetalle },
        { path: 'mis-cotizaciones', component: MisCotizaciones },
        { path: 'solicitar-cotizacion', component: SolicitarCotizacion },
      ]
    },

    {
      path: 'vendedor',
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: VendedorDashboard },
        { path: 'cotizaciones', component: VendedorCotizaciones },
        { path: 'detalle-cotizacion', component: VendedorDetalle },
        { path: 'nueva-cotizacion', component: NuevaCotizacion },
        { path: 'nueva-cotizacion-cliente', component: NuevaCotizacionCliente },
      ]
    },

    { path: '**', redirectTo: '' }
];
