import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './components/tabelas/edit-user/edit-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CookieService } from 'ngx-cookie-service';
import { EditVehicleComponent } from './components/tabelas/edit-vehicle/edit-vehicle.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { CreateReservaComponent } from './components/reservas/create-reserva/create-reserva.component';
import { SidebarComponent } from './components/admin-dashboard/sidebar/sidebar.component';
import { ListUsersComponent } from './components/tabelas/list-users/list-users.component';
import { ListVehiclesComponent } from './components/tabelas/list-vehicles/list-vehicles.component';
import { BaseAdminDashboardComponent } from './components/admin-dashboard/base-admin-dashboard/base-admin-dashboard.component';
import { EditReservesComponent } from './components/gestao/edit-reserves/edit-reserves.component';
import { ListReservesComponent } from './components/gestao/list-reserves/list-reserves.component';
import { ListPendantsComponent } from './components/tabelas/list-pendants/list-pendants.component';
import { EditPendantsComponent } from './components/tabelas/edit-pendants/edit-pendants.component';
import { SidebarReservasComponent } from './components/reservas/sidebar-reservas/sidebar-reservas.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ScheduleReservesComponent } from './components/reservas/schedule-reserves/schedule-reserves.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ListUserPendingsComponent } from './components/reservas/list-user-pendings/list-user-pendings.component';
import { CreateReservaScheduleComponent } from './components/reservas/create-reserva-schedule/create-reserva-schedule.component';
import { AprovePendingsComponent } from './components/gestao/aprove-pendings/aprove-pendings.component';
import { TabelasComponent } from './components/tabelas/tabelas.component';
import { GestaoComponent } from './components/gestao/gestao.component';
import { SidebarTabelasComponent } from './components/tabelas/sidebar-tabelas/sidebar-tabelas.component';
import { SidebarGestaoComponent } from './components/gestao/sidebar-gestao/sidebar-gestao.component';
import { EmptyStateTabelasComponent } from './components/tabelas/empty-state-tabelas/empty-state-tabelas.component';
import { EmptyStateGestaoComponent } from './components/gestao/empty-state-gestao/empty-state-gestao.component';
import { ListTypeVehiclesComponent } from './components/tabelas/list-type-vehicles/list-type-vehicles.component';
import { ListGroupUsersComponent } from './components/tabelas/list-group-users/list-group-users.component';
import { EditTypeVehiclesComponent } from './components/tabelas/edit-type-vehicles/edit-type-vehicles.component';
import { EditGroupUsersComponent } from './components/tabelas/edit-group-users/edit-group-users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AprovePendingsToChangePasswordComponent } from './components/gestao/aprove-pendings-to-change-password/aprove-pendings-to-change-password.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SidebarReportsComponent } from './components/reports/sidebar-reports/sidebar-reports.component';
import { ReportsReservesComponent } from './components/reports/reports-reserves/reports-reserves.component';
import { ReportsPendingsComponent } from './components/reports/reports-pendings/reports-pendings.component';
import { EmptyStateReportsComponent } from './components/reports/empty-state-reports/empty-state-reports.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminDashboardComponent,
    EditUserComponent,
    NavbarComponent,
    EditVehicleComponent,
    ReservasComponent,
    CreateReservaComponent,
    SidebarComponent,
    ListUsersComponent,
    ListVehiclesComponent,
    BaseAdminDashboardComponent,
    EditReservesComponent,
    ListReservesComponent,
    ListPendantsComponent,
    EditPendantsComponent,
    SidebarReservasComponent,
    ScheduleReservesComponent,
    ListUserPendingsComponent,
    CreateReservaScheduleComponent,
    AprovePendingsComponent,
    TabelasComponent,
    GestaoComponent,
    SidebarTabelasComponent,
    SidebarGestaoComponent,
    EmptyStateTabelasComponent,
    EmptyStateGestaoComponent,
    ListTypeVehiclesComponent,
    ListGroupUsersComponent,
    EditTypeVehiclesComponent,
    EditGroupUsersComponent,
    UserProfileComponent,
    AprovePendingsToChangePasswordComponent,
    ReportsComponent,
    SidebarReportsComponent,
    ReportsReservesComponent,
    ReportsPendingsComponent,
    EmptyStateReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    CookieService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
