import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DAFService } from '../services/daf.service';
import Swal from 'sweetalert2';


// 👇 Needed to manipulate modal
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  showPassword = false
  constructor(
    private authService: AuthService,
    private dafService: DAFService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        const userId = response.userId;
        const userName = response.name;
  
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
  
        this.dafService.getDAFAccount(userId).subscribe({
          next: () => {
            Swal.fire({
                      icon: 'success',
                      title: 'Login Successful!',
                      html: `Welcome <b>${userName}</b>`,
                      width: '400px',
                      heightAuto: false,
                      confirmButtonText: 'Go to Dashboard',
                      confirmButtonColor: '#005F83'
                    }).then(() => this.router.navigate(['/dashboard']));
            
          },
          error: () => {
            const modal = new bootstrap.Modal(document.getElementById('dafErrorModal'));
            modal.show();
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          width: '400px',
          heightAuto: false,
          text: 'Invalid email or password. Please try again.',
          confirmButtonColor: '#005F83'
        });
      }
    });
  }
}
