import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls:['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // 1️⃣ Get token from URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // 2️⃣ Build form
    this.form = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.form.invalid) return;

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const data = {
      token: this.token,
      newPassword: this.form.value.newPassword
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        alert('Password reset successful');
        this.router.navigate(['/auth/login']);   // ✅ correct navigation
      },
      error: (err) => {
        alert(err.error?.message || 'Invalid or expired token');
      }
    });
  }
}