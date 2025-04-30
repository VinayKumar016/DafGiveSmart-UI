import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharityService {
  private apiUrl = 'http://localhost:5269/api/charities';

  constructor(private http: HttpClient) {}

  getAllCharities() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
