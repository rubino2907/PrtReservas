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

  constructor(){}

  toggleCreateReserve(createReserveActive: boolean){
    this.showCreateReserve = createReserveActive;
    this.showReserveRequests = !createReserveActive;
  }

  toggleReserveRequests(reserveRequestsActive: boolean){
    this.showReserveRequests = reserveRequestsActive;
    this.showCreateReserve = !reserveRequestsActive;
  }
}
