import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component'; // Importe o FormsModule aqui
import { CookieService } from 'ngx-cookie-service';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { CreateReservaComponent } from './components/reservas/create-reserva/create-reserva.component';
// Importe os módulos do Angular Material necessários
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core'; // Adicione este módulo para datas nativas
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SidebarComponent } from './components/admin-dashboard/sidebar/sidebar.component';
import { ListUsersComponent } from './components/admin-dashboard/list-users/list-users.component';
import { ListVehiclesComponent } from './components/admin-dashboard/list-vehicles/list-vehicles.component';
import { BaseAdminDashboardComponent } from './components/admin-dashboard/base-admin-dashboard/base-admin-dashboard.component';
import { EditReservesComponent } from './components/edit-reserves/edit-reserves.component';
import { ListReservesComponent } from './components/admin-dashboard/list-reserves/list-reserves.component';
import { ListPendantsComponent } from './components/admin-dashboard/list-pendants/list-pendants.component';
import { EditPendantsComponent } from './components/edit-pendants/edit-pendants.component';

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
    EditPendantsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule, // Certifique-se de incluir este módulo para datas nativas
    BsDatepickerModule.forRoot()
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
