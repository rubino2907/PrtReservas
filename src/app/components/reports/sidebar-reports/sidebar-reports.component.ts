import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarStateGestaoService } from '../../../services/sidebarServices/sidebar-gestao.service';

@Component({
  selector: 'app-sidebar-reports',
  templateUrl: './sidebar-reports.component.html',
  styleUrl: './sidebar-reports.component.css'
})
export class SidebarReportsComponent {
  showRelatoriosReservasListActive: boolean = false; 
  showRelatoriosPedidosListActive: boolean = false;


  showOptions: boolean = true;

  @Output() toggleReservesListEvent = new EventEmitter<boolean>(); 
  @Output() toggleToListAprovedEvent = new EventEmitter<boolean>();

  constructor(private sidebarStateService: SidebarStateGestaoService) {
    this.sidebarStateService.activeItem.subscribe(item => {
      this.showRelatoriosReservasListActive = item === 'reserveList';
      this.showRelatoriosPedidosListActive = item === 'aproveList';
      // Isto vai atualizar os botões para refletir o estado ativo
    });
  }

  toggleToAprovedList():void{
    if(!this.showRelatoriosPedidosListActive) {
      this.showRelatoriosReservasListActive = false; 
      this.showRelatoriosPedidosListActive = true;
    } else {
      this.showRelatoriosPedidosListActive = false;
    }
    this.toggleReservesListEvent.emit(false); 
    this.toggleToListAprovedEvent.emit(this.showRelatoriosPedidosListActive);
  }

  toggleReservesList(): void {
    if (!this.showRelatoriosReservasListActive) {
      this.showRelatoriosReservasListActive = true;
      this.showRelatoriosPedidosListActive = false;
    } else {
      this.showRelatoriosReservasListActive = false;
    }
    this.toggleReservesListEvent.emit(this.showRelatoriosReservasListActive);
    this.toggleToListAprovedEvent.emit(false);
  }
  
}
