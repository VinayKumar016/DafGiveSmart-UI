import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DAFService {
  private apiUrl = 'http://localhost:5269/api/DAF';

  constructor(private http: HttpClient) {}

  getDAFAccount(userId: number) {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
}
