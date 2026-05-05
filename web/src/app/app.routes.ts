import { Routes } from '@angular/router';
import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', loadComponent: () => import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent) },
      { path: 'clientes', loadComponent: () => import('./features/clientes/cliente-list').then((m) => m.ClienteListComponent) },
      { path: 'empleados', loadComponent: () => import('./features/empleados/empleado-list').then((m) => m.EmpleadoListComponent) },
      { path: 'vehiculos', loadComponent: () => import('./features/vehiculos/vehiculo-list').then((m) => m.VehiculoListComponent) },
      { path: 'metodos-pago', loadComponent: () => import('./features/metodos-pago/metodo-pago-list').then((m) => m.MetodoPagoListComponent) },
      { path: 'mantenimientos', loadComponent: () => import('./features/mantenimientos/mantenimiento-list').then((m) => m.MantenimientoListComponent) },
      { path: 'ventas', loadComponent: () => import('./features/ventas/venta-list').then((m) => m.VentaListComponent) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
