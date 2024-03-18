import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CookieService } from 'ngx-cookie-service';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { CreateReservaComponent } from './components/reservas/create-reserva/create-reserva.component';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core'; // Importe o MatDatetimepickerModule
import { MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { SidebarComponent } from './components/admin-dashboard/sidebar/sidebar.component';
import { ListUsersComponent } from './components/admin-dashboard/list-users/list-users.component';
import { ListVehiclesComponent } from './components/admin-dashboard/list-vehicles/list-vehicles.component';
import { BaseAdminDashboardComponent } from './components/admin-dashboard/base-admin-dashboard/base-admin-dashboard.component';
import { EditReservesComponent } from './components/edit-reserves/edit-reserves.component';
import { ListReservesComponent } from './components/admin-dashboard/list-reserves/list-reserves.component';
import { ListPendantsComponent } from './components/admin-dashboard/list-pendants/list-pendants.component';
import { EditPendantsComponent } from './components/edit-pendants/edit-pendants.component';
import { SidebarReservasComponent } from './components/reservas/sidebar-reservas/sidebar-reservas.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PedidosReservaComponent } from './components/reservas/pedidos-reserva/pedidos-reserva.component';


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
    PedidosReservaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDatetimepickerModule, // Use o MatDatetimepickerModule em vez do MatDatepickerModule
    MatNativeDatetimeModule, // Importe o MatNativeDatetimeModule para compatibilidade com datas nativas
  ],
  providers: [
    CookieService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
