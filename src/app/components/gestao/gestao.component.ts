import { Component } from '@angular/core';

@Component({
  selector: 'app-gestao',
  templateUrl: './gestao.component.html',
  styleUrl: './gestao.component.css'
})
export class GestaoComponent {

  
  title = 'WaveReservas';
  showReserveList: boolean = false;
  showAprovedList: boolean = false;
  showChangePasswordList: boolean = false;

  showOptions: boolean = false; // Controla a visibilidade das opções da barra lateral

  constructor(){}

  toggleReserveList(reserveListActive: boolean): void {
    this.showReserveList = reserveListActive;
    this.showAprovedList = !reserveListActive;
  }

  toggleToAprovedList(showAprovedListActive: boolean) : void {
    this.showReserveList = showAprovedListActive;
  }

}
