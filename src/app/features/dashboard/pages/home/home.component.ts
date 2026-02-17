import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  stats = {
    total: 0,
    completed: 0,
    pending: 0
  };

  loading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.dashboardService.getMyTasks().subscribe({
      next: (res: any) => {
        const tasks = res.data;

        this.stats.total = tasks.length;
        this.stats.completed = tasks.filter((t: any) => t.isCompleted).length;
        this.stats.pending = tasks.filter((t: any) => !t.isCompleted).length;

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }
}
