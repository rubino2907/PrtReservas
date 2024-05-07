import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarStateGestaoService } from '../../../services/sidebarServices/sidebar-gestao.service';

@Component({
  selector: 'app-empty-state-gestao',
  templateUrl: './empty-state-gestao.component.html',
  styleUrl: './empty-state-gestao.component.css'
})
export class EmptyStateGestaoComponent {
  
  reservesListActive: boolean = false; 
  showAprovedListActive: boolean = false;
  showChangePasswordListActive: boolean = false;

  showOptions: boolean = true;

  @Output() toggleReservesListEvent = new EventEmitter<boolean>(); 
  @Output() toggleToListAprovedEvent = new EventEmitter<boolean>();
  @Output() toggleShowChangePasswordEvent = new EventEmitter<boolean>();

  constructor(private sidebarStateService: SidebarStateGestaoService){}

  toggleToAprovedList():void{
    this.sidebarStateService.changeActiveItem('aproveList');
    if(!this.showAprovedListActive) {
      this.reservesListActive = false; 
      this.showAprovedListActive = true;
      this.showChangePasswordListActive = false;
    } else {
      this.showAprovedListActive = false;
    }
    this.toggleReservesListEvent.emit(false); 
    this.toggleShowChangePasswordEvent.emit(false); 
    this.toggleToListAprovedEvent.emit(this.showAprovedListActive);
  }

  toggleReservesList(): void {
    this.sidebarStateService.changeActiveItem('reserveList');
    if (!this.reservesListActive) {
      this.reservesListActive = true;
      this.showAprovedListActive = false;
      this.showChangePasswordListActive = false;
    } else {
      this.reservesListActive = false;
    }
    this.toggleReservesListEvent.emit(this.reservesListActive);
    this.toggleToListAprovedEvent.emit(false);
    this.toggleShowChangePasswordEvent.emit(false); 
  }

  toggleShowChangePassword(): void {
    this.sidebarStateService.changeActiveItem('reserveList');
    if (!this.reservesListActive) {
      this.reservesListActive = false;
      this.showAprovedListActive = false;
      this.showChangePasswordListActive = true;
    } else {
      this.reservesListActive = false;
    }
    this.toggleReservesListEvent.emit(false);
    this.toggleToListAprovedEvent.emit(false);
    this.toggleShowChangePasswordEvent.emit(this.showChangePasswordListActive); 
  }

}
