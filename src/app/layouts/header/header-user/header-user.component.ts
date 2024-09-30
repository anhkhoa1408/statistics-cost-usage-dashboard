import { Component, Optional } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.scss',
})
export class HeaderUserComponent {
  user: User | null = null;

  constructor(
    @Optional() private authService: AuthService,
    private router: Router
  ) {
    authService.user.subscribe((user) => (this.user = user));
  }

  signOut = async () => {
    await this.authService.logout();
    this.router.navigate(['auth/sign-in']);
  };
}
