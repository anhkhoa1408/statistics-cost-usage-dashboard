import { Injectable, OnDestroy, Optional } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router } from '@angular/router';
import {
  EMPTY,
  firstValueFrom,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  constructor(
    @Optional() private auth: Auth,
    private readonly userService: UserService,
    private router: Router
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map((u) => !!u)
      );
    }
  }

  ngOnDestroy(): void {
    this.userDisposable?.unsubscribe();
  }

  initialize() {
    this.auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const isCreated = !!(await firstValueFrom(
        this.userService
          .getUserByEmail(user?.email || '')
          .pipe(map((users) => users.length))
      ));

      if (!isCreated && user.displayName && user.email)
        this.userService.addUser({
          name: user.displayName,
          email: user.email,
        });

      this.router.navigate(['dashboard/overview']);
    });
  }

  async login() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    await signOut(this.auth);
  }
}
