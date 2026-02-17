import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'https://localhost:7077/api/v1';

  constructor(private http: HttpClient) {}

  getCurrentUser() {
    return this.http.get<any>(`${this.baseUrl}/auth/me`);
  }

  getMyTasks() {
    return this.http.get<any>(`${this.baseUrl}/task/my`);
  }

  createTask(data: { title: string }) {
    return this.http.post<any>(`${this.baseUrl}/task`, data);
  }

  updateTask(id: number, data: { title: string; isCompleted: boolean }) {
    return this.http.put<any>(`${this.baseUrl}/task/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/task/${id}`);
  }
}
