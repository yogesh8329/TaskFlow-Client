import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  loginForm: FormGroup;
  loading = false;
  submitted = false;

 constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Strict-mode safe getters
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    

this.authService.login(this.loginForm.value).subscribe({
  next: (res: any) => {
    console.log('Login Success:', res);

    const token = res.data.token;   // 🔥 FIX
    localStorage.setItem('token', token);

    this.loading = false;
    this.router.navigate(['/dashboard']);
  },
  error: (err: any) => {
    console.error('Login failed:', err);
    this.loading = false;
  }
});
  }}