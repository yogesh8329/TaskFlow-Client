import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from '../../toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div *ngIf="message"
         [ngStyle]="{
           position: 'fixed',
           top: '80px',
           right: '20px',
           padding: '12px 20px',
           borderRadius: '6px',
           color: 'white',
           backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
           zIndex: '999999',
           fontWeight: '600'
         }">
      {{ message }}
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  message: string | null = null;
  type: 'success' | 'error' = 'success';

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast: ToastMessage) => {

      console.log('Toast Received:', toast);

      if (!toast || !toast.message) return;

      this.message = toast.message;
      this.type = toast.type;

      setTimeout(() => {
        this.message = null;
      }, 3000);

    });
  }
}