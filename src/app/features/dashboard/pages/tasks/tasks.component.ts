import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: any[] = [];
  newTaskTitle = '';
  loading = false;

  filter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    this.dashboardService.getMyTasks().subscribe({
      next: (res: any) => {
        this.tasks = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
        this.loading = false;
      }
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    this.dashboardService.createTask({
      title: this.newTaskTitle
    }).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.loadTasks();
      },
      error: (err: any) => {
        console.error('Create failed:', err);
      }
    });
  }

  toggleComplete(task: any): void {

    this.dashboardService.updateTask(task.id, {
      title: task.title,
      isCompleted: !task.isCompleted
    }).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted; // instant UI update
      },
      error: (err: any) => {
        console.error('Update failed:', err);
      }
    });
  }

  deleteTask(id: number): void {
    this.dashboardService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id); // no reload
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
      }
    });
  }

  setFilter(type: 'all' | 'completed' | 'pending') {
    this.filter = type;
  }

  get filteredTasks() {

    if (this.filter === 'completed') {
      return this.tasks.filter(t => t.isCompleted);
    }

    if (this.filter === 'pending') {
      return this.tasks.filter(t => !t.isCompleted);
    }

    return this.tasks;
  }
}
