import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-reservas',
  templateUrl: './sidebar-reservas.component.html',
  styleUrls: ['./sidebar-reservas.component.css']
})
export class SidebarReservasComponent {
  createReserveActive: boolean = false;
  reserveRequestsActive: boolean = false;
  opentwoOptions: boolean = false;
  showCalendareActive: boolean = false;
  listPedidoVehicle: boolean = false;

  @Output() toggleCreateReserveEvent = new EventEmitter<boolean>();
  @Output() toggleReserveRequestsEvent = new EventEmitter<boolean>();
  @Output() toggleCalendarEvent = new EventEmitter<boolean>();

  toggleCreate() {
    this.opentwoOptions = !this.opentwoOptions;
    this.toggleReserveRequestsEvent.emit(false);
    this.reserveRequestsActive = false;
    this.createReserveActive = false;
    this.showCalendareActive = false;
  }

  toggleCreateReserve() {
    this.createReserveActive = !this.createReserveActive;
    this.toggleCreateReserveEvent.emit(this.createReserveActive);
    this.toggleReserveRequestsEvent.emit(false);
    this.toggleCalendarEvent.emit(false);
    this.showCalendareActive = false;
  }

  toggleShowCalendar() {
    this.showCalendareActive = !this.showCalendareActive;
    this.toggleCalendarEvent.emit(this.showCalendareActive);
    this.toggleReserveRequestsEvent.emit(false);
    this.toggleCreateReserveEvent.emit(false);
    this.createReserveActive = false;
  }

  toggleReserveRequests() {
    this.reserveRequestsActive = !this.reserveRequestsActive;
    this.toggleReserveRequestsEvent.emit(this.reserveRequestsActive);
    this.toggleCreateReserveEvent.emit(false);
    this.toggleCalendarEvent.emit(false);
    this.showCalendareActive = false;
    this.createReserveActive = false;
    this.opentwoOptions = false;
  }
}
