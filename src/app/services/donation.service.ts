import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:5269/api/donations';

  constructor(private http: HttpClient) {}

  getUserDonations(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  addDonation(donation: any) {
    return this.http.post(`${this.apiUrl}/add`, donation);
  }
}
