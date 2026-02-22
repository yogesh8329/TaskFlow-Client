import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new Subject<ToastMessage>();

  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error') {
    this.toastSubject.next({ message, type });
  }
}