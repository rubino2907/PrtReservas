import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] 
})
export class AdminDashboardComponent {
  title = 'WaveReservas';
  showUserList: boolean = false;
  showVehicleList: boolean = false;
  showReserveList: boolean = false;
  showPendantList: boolean = false;

  constructor(){}

  toggleUserList(userListActive: boolean): void {
    this.showUserList = userListActive;
    this.showVehicleList = !userListActive;
    this.showReserveList = false; // Oculta a lista de reservas quando a lista de usuários é ativada
  }

  toggleVehicleList(vehicleListActive: boolean): void {
    this.showVehicleList = vehicleListActive;
    this.showUserList = !vehicleListActive;
    this.showReserveList = false; // Oculta a lista de reservas quando a lista de veículos é ativada
  }

  toggleReserveList(reserveListActive: boolean): void {
    this.showReserveList = reserveListActive;
    this.showUserList = !reserveListActive;
    this.showVehicleList = !reserveListActive;
  }

  togglePendantList(pendantListActive: boolean): void {
    this.showPendantList = pendantListActive;
    this.showUserList = !pendantListActive;
    this.showVehicleList = !pendantListActive;
    this.showReserveList = !pendantListActive;
  }
}
