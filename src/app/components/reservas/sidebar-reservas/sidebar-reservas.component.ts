import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-reservas',
  templateUrl: './sidebar-reservas.component.html',
  styleUrls: ['./sidebar-reservas.component.css'] // Correção aqui
})
export class SidebarReservasComponent {
  createReserveActive: boolean = false;
  reserveRequestsActive: boolean = false;

  @Output() toggleCreateReserveEvent = new EventEmitter<boolean>();
  @Output() toggleReserveRequestsEvent = new EventEmitter<boolean>();

  toggleCreateReserve() {
    if(!this.createReserveActive){
      this.createReserveActive = true;
      this.reserveRequestsActive = false;
    }else{
      this.createReserveActive = false;
    }
    this.toggleCreateReserveEvent.emit(this.createReserveActive); // Emitir o evento com o estado atual
    this.toggleReserveRequestsEvent.emit(false);
  }

  toggleReserveRequests() {
    if(!this.reserveRequestsActive){
      this.reserveRequestsActive = true;
      this.createReserveActive = false;
    }else{
      this.reserveRequestsActive = false;
    }
    this.toggleReserveRequestsEvent.emit(this.reserveRequestsActive); // Emitir o evento com o estado atual
    this.toggleCreateReserveEvent.emit(false);
  }
}
