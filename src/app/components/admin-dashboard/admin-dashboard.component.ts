import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] 
})
export class AdminDashboardComponent implements OnInit{
  title = 'WaveReservas';
  showUserList: boolean = false;
  showVehicleList: boolean = false;
  showReserveList: boolean = false;
  showPendantList: boolean = false;
  showAprovedList: boolean = false;

  showOptions: boolean = false; // Controla a visibilidade das opções da barra lateral

  constructor(private sidebarService: SidebarService){}

  ngOnInit(): void {
    // Ocultar as opções da barra lateral ao entrar na página da dashboard
    this.sidebarService.hideOptions();
    // Definir showOptions como true para exibir as opções da barra lateral
    this.showOptions = true;
  }

  toggleUserList(userListActive: boolean): void {
    this.showUserList = userListActive;
    this.showVehicleList = !userListActive;
    this.showAprovedList = !userListActive;
    this.showReserveList = false; // Oculta a lista de reservas quando a lista de usuários é ativada
  }

  toggleVehicleList(vehicleListActive: boolean): void {
    this.showVehicleList = vehicleListActive;
    this.showUserList = !vehicleListActive;
    this.showAprovedList = !vehicleListActive;
    this.showReserveList = false; // Oculta a lista de reservas quando a lista de veículos é ativada
  }

  toggleReserveList(reserveListActive: boolean): void {
    this.showReserveList = reserveListActive;
    this.showUserList = !reserveListActive;
    this.showVehicleList = !reserveListActive;
    this.showAprovedList = !reserveListActive;
  }

  togglePendantList(pendantListActive: boolean): void {
    this.showPendantList = pendantListActive;
    this.showUserList = !pendantListActive;
    this.showVehicleList = !pendantListActive;
    this.showReserveList = !pendantListActive;
  }

  toggleToAprovedList(showAprovedListActive: boolean) : void {
    this.showPendantList = !showAprovedListActive;
    this.showUserList = !showAprovedListActive;
    this.showVehicleList = !showAprovedListActive;
    this.showReserveList = showAprovedListActive;
  }
}
