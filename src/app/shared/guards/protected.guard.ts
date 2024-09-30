import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const protectedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(
    map((user) => {
      if (!user) {
        return router.createUrlTree(['auth/sign-in']);
      } else {
        return true;
      }
    })
  );
};
