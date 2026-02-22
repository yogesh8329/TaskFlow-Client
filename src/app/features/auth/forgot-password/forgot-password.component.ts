import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
onSubmit() {

  if (this.form.invalid) return;

  this.loading = true;

  this.authService
    .forgotPassword(this.form.value.email)
    .subscribe({
      next: () => {
        alert('If email exists, reset link sent.');
        this.loading = false;
      },
      error: () => {
        alert('Something went wrong');
        this.loading = false;
      }
    });
}

}
