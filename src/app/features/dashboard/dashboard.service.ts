import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser() {
    return this.http.get<any>(`${this.baseUrl}/auth/me`);
  }

  // ✅ PAGINATED GET
  getTasks(page: number, pageSize: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Task?page=${page}&pageSize=${pageSize}`
    );
  }

  createTask(data: any) {
    return this.http.post<any>(`${this.baseUrl}/task`, data);
  }

  updateTask(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/task/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/task/${id}`);
  }
}
