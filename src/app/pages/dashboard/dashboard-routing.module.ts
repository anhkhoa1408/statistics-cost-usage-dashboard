import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { UsageComponent } from './usage/usage.component';
import { protectedGuard } from './../../shared/guards/protected.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [protectedGuard],
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'usage',
        component: UsageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
