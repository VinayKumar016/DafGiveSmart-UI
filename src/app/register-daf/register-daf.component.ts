import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-daf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-daf.component.html',
  styleUrls: ['./register-daf.component.css']
})
export class RegisterDafComponent {
  user = {
    name: '',
    email: '',
    password: '',
    mobile: '',
    location: '',
    registrationSource: 'DAF'
  };

  confirmPassword = '';
  emailExists = false;
  passwordsMatch = true;
  confirmTouched = false;
  showPassword = false;
  showConfirmPassword = false;
  showTooltip = false;
showRulesExpanded = false;


  passwordRules = {
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    isLongEnough: false
  };

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordStrength(password: string) {
    this.passwordRules.hasUpper = /[A-Z]/.test(password);
    this.passwordRules.hasLower = /[a-z]/.test(password);
    this.passwordRules.hasNumber = /[0-9]/.test(password);
    this.passwordRules.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordRules.isLongEnough = password.length >= 8;
  }

 

  checkPasswordMatch() {
    this.confirmTouched = true;
    this.passwordsMatch = this.user.password === this.confirmPassword;
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordRules).every(rule => rule);
  }

  registerUser() {
    this.confirmTouched = true;
    this.showRulesExpanded = true;
  
    if (!this.isPasswordValid() || !this.passwordsMatch) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Invalid',
        text: 'Please ensure your password meets the requirements.',
        width: '400px',
        heightAuto: false,
        confirmButtonColor: '#005F83'
      });

      return; // Let UI show field-specific feedback
    }

    if(this.emailExists) {
      Swal.fire({
        icon: 'warning',
        title: 'Email already exists',
        text: 'Please use a different email.',
        width: '400px',
        heightAuto: false,
        confirmButtonColor: '#005F83'
      });
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords do not match',
        text: 'Please re-enter your password.',
        width: '400px',
        heightAuto: false,
        confirmButtonColor: '#005F83'
      });
      return;
    }

    if (this.user.mobile.length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid mobile number',
        text: 'Please enter a valid mobile number.',
        width: '400px',
        heightAuto: false,
        confirmButtonColor: '#005F83'
      });
      return;
    }

    
    if (!this.user.email || !this.user.name || !this.user.mobile || !this.user.location) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill all required fields.',
        width: '400px',
        heightAuto: false,
        confirmButtonColor: '#005F83'
      });
      return;
    }
  
    this.authService.registerUser(this.user).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `Your DAF Account Number is <b>${res.dafAccountNumber}</b>`,
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#005F83'
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err) => {
        if (err.status === 400 && err.error === 'Email already exists.') {
          this.emailExists = true;
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Registration failed. Try again.',
            width: '400px',
            heightAuto: false,
            confirmButtonColor: '#005F83'
            });
        }
      }
    });
  }
  
  
}
