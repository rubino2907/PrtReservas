import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrigido de 'styleUrl' para 'styleUrls'
})
export class SidebarComponent {
  userListActive: boolean = false;
  vehicleListActive: boolean = false;
  reservesListActive: boolean = false; 
  pendantListActive: boolean = false; 

  @Output() toggleUserListEvent = new EventEmitter<boolean>();
  @Output() toggleVehicleListEvent = new EventEmitter<boolean>();
  @Output() toggleReservesListEvent = new EventEmitter<boolean>(); 
  @Output() togglePendantListEvent = new EventEmitter<boolean>();

  toggleUserList(): void {
    if (!this.userListActive) {
      this.userListActive = true;
      this.vehicleListActive = false;
      this.reservesListActive = false; 
      this.pendantListActive = false; // Adicionado
    } else {
      this.userListActive = false;
    }
    this.toggleUserListEvent.emit(this.userListActive);
    this.toggleVehicleListEvent.emit(false);
    this.toggleReservesListEvent.emit(false); 
    this.togglePendantListEvent.emit(false); // Adicionado
  }

  toggleVehicleList(): void {
    if (!this.vehicleListActive) {
      this.vehicleListActive = true;
      this.userListActive = false;
      this.reservesListActive = false; 
      this.pendantListActive = false; // Adicionado
    } else {
      this.vehicleListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(this.vehicleListActive);
    this.toggleReservesListEvent.emit(false); 
    this.togglePendantListEvent.emit(false); // Adicionado
  }

  toggleReservesList(): void {
    if (!this.reservesListActive) {
      this.reservesListActive = true;
      this.userListActive = false;
      this.vehicleListActive = false;
      this.pendantListActive = false; // Adicionado
    } else {
      this.reservesListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(false);
    this.toggleReservesListEvent.emit(this.reservesListActive);
    this.togglePendantListEvent.emit(false); // Adicionado
  }

  togglePendantList(): void {
    if (!this.pendantListActive) {
      this.pendantListActive = true;
      this.reservesListActive = false;
      this.userListActive = false;
      this.vehicleListActive = false;
    } else {
      this.pendantListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(false);
    this.toggleReservesListEvent.emit(false);
    this.togglePendantListEvent.emit(this.pendantListActive); // Adicionado
  }


}
