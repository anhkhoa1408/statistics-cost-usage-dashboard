import { Component, Optional } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  user: User | null = null;

  constructor(@Optional() auth: Auth) {
    this.user = auth.currentUser;
  }
}
