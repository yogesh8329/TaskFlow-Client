import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

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

    // Using existing paginated API
    this.dashboardService.getTasks(1, 1000).subscribe({
      next: (res: any) => {

        const paged = res.data;
        const tasks: Task[] = paged.items;

        this.stats.total = paged.totalCount;

        this.stats.completed =
          tasks.filter(t => t.status === 'Completed').length;

        this.stats.pending =
          tasks.filter(t => t.status === 'Pending').length;

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }
}
