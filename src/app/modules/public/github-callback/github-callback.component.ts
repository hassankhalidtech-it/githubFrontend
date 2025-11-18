import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-github-callback',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './github-callback.component.html',
  styleUrl: './github-callback.component.scss'
})
export class GithubCallbackComponent {
  message = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.message = `GitHub error: ${error}`;
        return;
      }
      if (!code) {
        this.message = 'No code found.';
        return;
      }

      this.sendCode(code);


    });
  }

  sendCode(code: any) {
    this.auth.exchangeCode(code).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.message = 'GitHub connected successfully!';
          this.isSuccess = true;
        } else {
          this.message = 'Failed to authenticate token.';
          this.isSuccess = false;
        }
      },
      error: (err) => {
        console.error('Exchange error:', err);
        this.message = 'Token authentication failed. Please try again.';
        this.isSuccess = false;
      },
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
  
}
