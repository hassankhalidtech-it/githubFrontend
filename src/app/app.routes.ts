import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/public/public.routing').then(m => m.routes)
  },
  {
    path: 'home',
    canActivate:[AuthGuard],
    loadChildren: () => import('./modules/user/user.routing').then(m => m.routes)
  }
];
