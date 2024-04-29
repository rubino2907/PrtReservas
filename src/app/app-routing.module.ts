import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { TabelasComponent } from './components/tabelas/tabelas.component';
import { GestaoComponent } from './components/gestao/gestao.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'adminDashboard', component: AdminDashboardComponent },
  { path: 'reservas', component: ReservasComponent},
  { path: 'tabelas', component: TabelasComponent},
  { path: 'gestao', component: GestaoComponent},
  { path: 'userProfile', component: UserProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
