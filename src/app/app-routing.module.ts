import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ReservasComponent } from './components/reservas/reservas.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'adminDashboard', component: AdminDashboardComponent },
  { path: 'reservas', component: ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
