import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

import { MatButtonModule } from '@angular/material/button';
import { PageTitleComponent } from './../../shared/components/page-title/page-title.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './overview/overview.component';

import { FooterComponent } from './../../layouts/footer/footer/footer.component';
import { HeaderUserComponent } from './../../layouts/header/header-user/header-user.component';
import { HeaderComponent } from './../../layouts/header/header/header.component';
import { SidebarHeaderComponent } from './../../layouts/sidebar/sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './../../layouts/sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarComponent } from './../../layouts/sidebar/sidebar.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatHint, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faChartSimple,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { RevoGrid } from '@revolist/angular-datagrid';
import { BaseChartDirective } from 'ng2-charts';
import { CostAdditionComponent } from './usage/cost-addition/cost-addition.component';
import { UsageComponent } from './usage/usage.component';
import { TrashedButtonComponent } from './usage/trashed-button/trashed-button.component';
@NgModule({
  declarations: [
    // page components
    DashboardComponent,
    OverviewComponent,
    UsageComponent,
    CostAdditionComponent,

    // layout components
    FooterComponent,
    HeaderComponent,
    HeaderUserComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarMenuComponent,

    TrashedButtonComponent,
  ],
  imports: [
    // app modules
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,

    // external modules
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatHint,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RevoGrid,

    // standalone components
    PageTitleComponent,

    // directive
    BaseChartDirective,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    CurrencyPipe,
  ],
  bootstrap: [DashboardComponent],
})
export class DashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faChartSimple, faCalendar, faChevronDown);
  }
}
