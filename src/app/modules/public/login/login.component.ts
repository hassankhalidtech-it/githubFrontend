import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  connection: 'connected' | 'connecting' | 'failed' | 'idle' = 'idle';
  message = '';
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkStatus();
  }

  login() {
    this.connection = 'connecting';
    this.auth.loginWithGitHub();
  }

  checkStatus() {
    this.auth.getIntegrationStatus().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.connection = 'connected';
          this.message = 'Already connected to GitHub!';
          setTimeout(() => this.router.navigate(['/home']), 1500);
        } else {
          this.connection = 'idle';
        }
      },
      error: (err: any) => {
        console.error('Status check failed:', err);
        this.connection = 'failed';
      }
    });
  }
}

