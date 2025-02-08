import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username: any;
  password: any
  error: any;
  blnReg: any;
  email: any;

  message: any;


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => this.error = 'Invalid credentials'
    });

    if (this.blnReg) {

      this.authService.register(this.username, this.email, this.password).subscribe({
        next: (response: any) => {
          this.message = 'Registration successful! Redirecting to login...';
          this.error = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error.error || 'Registration failed';
          this.message = '';
        }
      });
    }
  }

  gotoreg() {
    this.blnReg = true;
  }

  goToLogin() { 
    this.blnReg = false;
  }

  logout() {
    localStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }


}
