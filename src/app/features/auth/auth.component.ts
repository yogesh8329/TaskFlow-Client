import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast:ToastService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {

    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {

        const token = res.data.token;
        localStorage.setItem('token', token);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {

        this.loading = false;

        if (err.status === 401) {
          this.loginError = 'Invalid email or password';
        } else {
          this.loginError = 'Invalid email or password.';
        }
      }
    });
  }
}