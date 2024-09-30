import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [AuthComponent, SignInComponent],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatInputModule,
  ],
  bootstrap: [AuthComponent],
})
export class AuthModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faGoogle);
  }
}
