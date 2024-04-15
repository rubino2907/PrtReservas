import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebar-tables.service';

@Component({
  selector: 'app-sidebar-tabelas',
  templateUrl: './sidebar-tabelas.component.html',
  styleUrl: './sidebar-tabelas.component.css'
})
export class SidebarTabelasComponent {

  userListActive: boolean = false;
  vehicleListActive: boolean = false;
  pendantListActive: boolean = false; 
  opentwoOptions: boolean = false;
  showOptions: boolean = false;
  showCreateTypeVehicleActive: boolean = false;
  showCreateGroupUserActive: boolean = false;

  
  @Output() toggleUserListEvent = new EventEmitter<boolean>();
  @Output() toggleVehicleListEvent = new EventEmitter<boolean>();
  @Output() togglePendantListEvent = new EventEmitter<boolean>();
  @Output() toggleCreateGroupUserEvent = new EventEmitter<boolean>();
  @Output() toggleCreateTypeVehicleEvent = new EventEmitter<boolean>();

  toggleCreateDropdown() {
    this.opentwoOptions = !this.opentwoOptions;
  }

  toggleUserList(): void {
    if (!this.userListActive) {
      this.userListActive = true;
      this.vehicleListActive = false;
      this.pendantListActive = false; // Adicionado
      this.opentwoOptions = false;
      this.showCreateTypeVehicleActive = false;
      this.showCreateGroupUserActive = false;
    } else {
      this.userListActive = false;
    }
    this.toggleUserListEvent.emit(this.userListActive);
    this.toggleVehicleListEvent.emit(false);
    this.togglePendantListEvent.emit(false); // Adicionado
    this.toggleCreateGroupUserEvent.emit(false);
    this.toggleCreateTypeVehicleEvent.emit(false);
  }

  toggleVehicleList(): void {
    if (!this.vehicleListActive) {
      this.vehicleListActive = true;
      this.userListActive = false;
      this.pendantListActive = false; // Adicionado
      this.opentwoOptions = false;
      this.showCreateTypeVehicleActive = false;
      this.showCreateGroupUserActive = false;
    } else {
      this.vehicleListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(this.vehicleListActive);
    this.togglePendantListEvent.emit(false); // Adicionado
    this.toggleCreateGroupUserEvent.emit(false);
    this.toggleCreateTypeVehicleEvent.emit(false);
  }

  togglePendantList(): void {
    if (!this.pendantListActive) {
      this.pendantListActive = true;
      this.userListActive = false;
      this.vehicleListActive = false;
      this.opentwoOptions = false;
      this.showCreateTypeVehicleActive = false;
      this.showCreateGroupUserActive = false;
    } else {
      this.pendantListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(false);
    this.togglePendantListEvent.emit(this.pendantListActive); // Adicionado
    this.toggleCreateGroupUserEvent.emit(false);
    this.toggleCreateTypeVehicleEvent.emit(false);
  }

  toggleCreateGroupUser() {
    if (!this.showCreateGroupUserActive) {
      this.pendantListActive = false;
      this.userListActive = false;
      this.vehicleListActive = false;
      this.showCreateTypeVehicleActive = false;
      this.showCreateGroupUserActive = true;
    } else {
      this.pendantListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(false);
    this.togglePendantListEvent.emit(false); // Adicionado
    this.toggleCreateGroupUserEvent.emit(this.showCreateGroupUserActive);
    this.toggleCreateTypeVehicleEvent.emit(false);
    
  }
  

  toggleCreateTypeVehicle(){
    if (!this.showCreateTypeVehicleActive) {
      this.pendantListActive = false;
      this.userListActive = false;
      this.vehicleListActive = false;
      this.showCreateTypeVehicleActive = true;
      this.showCreateGroupUserActive = false;
    } else {
      this.pendantListActive = false;
    }
    this.toggleUserListEvent.emit(false);
    this.toggleVehicleListEvent.emit(false);
    this.togglePendantListEvent.emit(false); // Adicionado
    this.toggleCreateGroupUserEvent.emit(false);
    this.toggleCreateTypeVehicleEvent.emit(this.showCreateTypeVehicleActive);
    
  }

}
