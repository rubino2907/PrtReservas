import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebar-tables.service';

@Component({
  selector: 'app-empty-state-tabelas',
  templateUrl: './empty-state-tabelas.component.html',
  styleUrl: './empty-state-tabelas.component.css'
})
export class EmptyStateTabelasComponent {

    userListActive: boolean = false;
    vehicleListActive: boolean = false;
    pendantListActive: boolean = false; 

    @Output() toggleUserListEvent = new EventEmitter<boolean>();
    @Output() toggleVehicleListEvent = new EventEmitter<boolean>();
    @Output() togglePendantListEvent = new EventEmitter<boolean>();

    constructor(private sidebarStateService: SidebarStateService){}

    toggleUserList(): void {
      this.sidebarStateService.changeActiveItem('userList');
      if (!this.userListActive) {
        this.userListActive = true;
        this.vehicleListActive = false;
        this.pendantListActive = false; // Adicionado
      } else {
        this.userListActive = false;
      }
      this.toggleUserListEvent.emit(this.userListActive);
      this.toggleVehicleListEvent.emit(false);
      this.togglePendantListEvent.emit(false); // Adicionado
    }

    toggleVehicleList(): void {
      this.sidebarStateService.changeActiveItem('vehicleList');
      if (!this.vehicleListActive) {
        this.vehicleListActive = true;
        this.userListActive = false;
        this.pendantListActive = false; // Adicionado
      } else {
        this.vehicleListActive = false;
      }
      this.toggleUserListEvent.emit(false);
      this.toggleVehicleListEvent.emit(this.vehicleListActive);
      this.togglePendantListEvent.emit(false); // Adicionado
    }

    togglePendantList(): void {
      this.sidebarStateService.changeActiveItem('pendants');
      if (!this.pendantListActive) {
        this.pendantListActive = true;
        this.userListActive = false;
        this.vehicleListActive = false;
      } else {
        this.pendantListActive = false;
      }
      this.toggleUserListEvent.emit(false);
      this.toggleVehicleListEvent.emit(false);
      this.togglePendantListEvent.emit(this.pendantListActive); // Adicionado
    }
}
