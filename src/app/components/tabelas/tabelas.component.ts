import { Component } from '@angular/core';

@Component({
  selector: 'app-tabelas',
  templateUrl: './tabelas.component.html',
  styleUrl: './tabelas.component.css'
})
export class TabelasComponent {
  title = 'WaveReservas';
  showUserList: boolean = false;
  showVehicleList: boolean = false;
  showPendantList: boolean = false;

  toggleUserList(userListActive: boolean): void {
    this.showUserList = userListActive;
    this.showVehicleList = !userListActive;
    this.showPendantList = !userListActive;
  }

  toggleVehicleList(vehicleListActive: boolean): void {
    this.showVehicleList = vehicleListActive;
    this.showUserList = !vehicleListActive;
    this.showPendantList = !vehicleListActive;
  }

  togglePendantList(pendantListActive: boolean): void {
    this.showPendantList = pendantListActive;
    this.showUserList = !pendantListActive;
    this.showVehicleList = !pendantListActive;
  }
}
