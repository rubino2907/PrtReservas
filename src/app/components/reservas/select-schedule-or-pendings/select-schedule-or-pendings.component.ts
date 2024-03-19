import { Component } from '@angular/core';

@Component({
  selector: 'app-select-schedule-or-pendings',
  templateUrl: './select-schedule-or-pendings.component.html',
  styleUrl: './select-schedule-or-pendings.component.css'
})
export class SelectScheduleOrPendingsComponent {
  showPedidos: boolean = false;
  showCalendare: boolean = false;

  showListPedidos() {
    this.showPedidos = !this.showPedidos; // Inverte o valor da variável
    this.showCalendare = false;
  }

  showCalendar() {
    this.showPedidos = false;
    this.showCalendare = !this.showCalendare;
  }
}
