import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { publicGuard } from '../../shared/guards/public.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [publicGuard],
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
