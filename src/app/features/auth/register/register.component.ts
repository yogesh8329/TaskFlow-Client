import { Component } from '@angular/core';
import { ToastService } from 'src/app/shared/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup, Validators,AbstractControl, ValidationErrors,} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  serverError = '';
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast:ToastService
  ) {

    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            )
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
            )
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {

    this.submitted = true;
    this.serverError = '';

    if (this.registerForm.invalid) return;

    this.loading = true;

    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.show('you are sucessfully Registerd', 'success');
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 409) {
  this.serverError = 'User already exists';
} 
else if (err.status === 400) {
  this.serverError = 'Invalid input';
}
else {
  this.serverError = 'Something went wrong. Try again.';
}
       
      }
    });
  }
}
