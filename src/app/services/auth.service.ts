import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5269/api/Users'; // 👈 change port if needed

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(tap(respose => {localStorage.setItem('token',respose.token)}));
  }
  getToken() {
    return localStorage.getItem('token'); // 👈 change port if needed
  }
  registerUser(userData: any) {
    return this.http.post<any>('http://localhost:5269/api/users/register', userData);
  }

 
  getUsers(){
    return this.http.get<any>(`${this.apiUrl}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }
  
}
