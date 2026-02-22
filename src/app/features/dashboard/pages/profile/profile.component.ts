import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userEmail: string = '';
  userRole: string = '';
  userId: string = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const payload: any = JSON.parse(atob(token.split('.')[1]));

      this.userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.userEmail = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      this.userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
  }
}