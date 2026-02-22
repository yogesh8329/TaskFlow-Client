import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ToastService } from 'src/app/shared/toast.service';
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  newTaskTitle = '';
  loading = false;

  editingTaskId: number | null = null;
  editTitle = '';

  filter: 'all' | 'completed' | 'pending' = 'all';

  // PAGINATION
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalCount = 0;

  constructor(
    private dashboardService: DashboardService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // ================= LOAD =================
  loadTasks(): void {
    this.loading = true;

    this.dashboardService
      .getTasks(this.currentPage, this.pageSize)
      .subscribe({
        next: (res: any) => {
          const paged = res.data;

          this.tasks = paged.items;
          this.totalCount = paged.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.toast.show('Failed to load tasks', 'error');
        }
      });
  }

  // ================= ADD =================
  addTask(): void {


    if (!this.newTaskTitle.trim()) {
      this.toast.show('Task title cannot be empty', 'error');
      return;
    }

    this.dashboardService.createTask({
      title: this.newTaskTitle,
      description: ''
    }).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.currentPage = 1;
        this.loadTasks();
        this.toast.show('Task created successfully', 'success');
      },
      error: () => {
        this.toast.show('Something went wrong', 'error');
      }
    });
  }

  // ================= EDIT =================
  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editTitle = task.title;
  }

  saveEdit(task: Task): void {

    if (!this.editTitle.trim()) {
      this.toast.show('Title cannot be empty', 'error');
      return;
    }

    this.dashboardService.updateTask(task.id, {
      title: this.editTitle,
      description: task.description,
      status: task.status
    }).subscribe({
      next: () => {
        this.editingTaskId = null;
        this.loadTasks();
        this.toast.show('Task updated successfully', 'success');
      },
      error: () => {
        this.toast.show('Something went wrong', 'error');
      }
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
  }

  // ================= TOGGLE =================
  toggleComplete(task: Task): void {

    const newStatus =
      task.status === 'Pending' ? 'Completed' : 'Pending';

    this.dashboardService.updateTask(task.id, {
      title: task.title,
      description: task.description,
      status: newStatus
    }).subscribe({
      next: () => {
        this.loadTasks();
        this.toast.show('Task status updated', 'success');
      },
      error: () => {
        this.toast.show('Failed to update status', 'error');
      }
    });
  }

  // ================= DELETE =================
  deleteTask(id: number): void {

    this.dashboardService.deleteTask(id).subscribe({
      next: () => {
        this.toast.show('Task deleted successfully', 'success');

        // If deleting last item of page, adjust page
        if (this.tasks.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.loadTasks();
      },
      error: (err) => {
        if (err.status === 403) {
          this.toast.show('You are not allowed to delete this task', 'error');
        } else {
          this.toast.show('Something went wrong', 'error');
        }
      }
    });
  }

  // ================= PAGINATION =================
  next(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  prev(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  // ================= FILTER =================
  setFilter(type: 'all' | 'completed' | 'pending'): void {
    this.filter = type;
  }

  get filteredTasks(): Task[] {

    if (this.filter === 'completed') {
      return this.tasks.filter(t => t.status === 'Completed');
    }

    if (this.filter === 'pending') {
      return this.tasks.filter(t => t.status === 'Pending');
    }

    return this.tasks;
  }
}