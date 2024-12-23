import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
   imports:[
        ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
    ],


})
export class RegistrationComponent {
  registrationForm: FormGroup;
    errorMessage: string = '';

  constructor(private readonly authService: AuthService,private readonly fb: FormBuilder, private readonly router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
    },
    {
           validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (password === confirmPassword) {
          return null
      } else {
          return { passwordsMismatch: true };
      }
    }

    onSubmit() {
        if (this.registrationForm.valid) {
            this.authService.registerUser(this.registrationForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    this.errorMessage = error.message || 'Registration failed. Please try again.';
                    console.error('Registration failed:', error);
                }
            });
        } else {
            this.errorMessage = 'Please fill in all required fields correctly.';
        }
    }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}