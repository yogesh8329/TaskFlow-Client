import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;
  loading = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

 loadUser(): void {
  this.loading = true;

  this.dashboardService.getCurrentUser().subscribe({
    next: (res: any) => {
      if (res && res.success) {
        this.user = res.data;
      } else {
        console.error('Invalid response format');
      }
      this.loading = false;
    },
    error: (err: any) => {
      console.error('User load failed:', err);
      localStorage.removeItem('token');
      this.router.navigate(['/auth']);
      this.loading = false;
    }
  });
}

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);  // 🔥 fixed
  }
}
