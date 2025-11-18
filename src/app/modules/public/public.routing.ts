import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GithubCallbackComponent } from './github-callback/github-callback.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'github-callback', component: GithubCallbackComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
