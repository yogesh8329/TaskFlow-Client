import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private baseUrl = `${environment.apiUrl}/Auth`;
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: { email: string; password: string }) {
    return this.http.post(
      `${this.baseUrl}/register`,
      data
    );
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(data: { token: string; newPassword: string }) {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

}