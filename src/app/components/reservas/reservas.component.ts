import { Component } from '@angular/core';
import { Pending } from '../../models/pending';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {

  pending: Pending = {
  };
  
  showCreateReserve: boolean = false;
  showReserveRequests: boolean = false;
  showCalendar: boolean = false;

  constructor(){}

  toggleCreateReserve(createReserveActive: boolean){
    this.showCreateReserve = createReserveActive;
    this.showReserveRequests = !createReserveActive;
    this.showCalendar = !createReserveActive;
  }

  toggleShowCalendar(createCalendarActive: boolean){
    this.showCalendar = createCalendarActive;
    this.showReserveRequests = !createCalendarActive;
    this.showCreateReserve = !createCalendarActive;
    
  }

  toggleReserveRequests(reserveRequestsActive: boolean){
    this.showReserveRequests = reserveRequestsActive;
    this.showCreateReserve = !reserveRequestsActive;
    this.showCalendar = !reserveRequestsActive;
  }
}
