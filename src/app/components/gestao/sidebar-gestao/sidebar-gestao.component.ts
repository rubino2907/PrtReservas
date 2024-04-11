import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarStateGestaoService } from '../../../services/sidebar-gestao.service';

@Component({
  selector: 'app-sidebar-gestao',
  templateUrl: './sidebar-gestao.component.html',
  styleUrl: './sidebar-gestao.component.css'
})
export class SidebarGestaoComponent {
  reservesListActive: boolean = false; 
  showAprovedListActive: boolean = false;

  showOptions: boolean = true;

  @Output() toggleReservesListEvent = new EventEmitter<boolean>(); 
  @Output() toggleToListAprovedEvent = new EventEmitter<boolean>();

  constructor(private sidebarStateService: SidebarStateGestaoService) {
    this.sidebarStateService.activeItem.subscribe(item => {
      this.reservesListActive = item === 'reserveList';
      this.showAprovedListActive = item === 'aproveList';
      // Isto vai atualizar os botões para refletir o estado ativo
    });
  }

  toggleToAprovedList():void{
    if(!this.showAprovedListActive) {
      this.reservesListActive = false; 
      this.showAprovedListActive = true;
    } else {
      this.showAprovedListActive = false;
    }
    this.toggleReservesListEvent.emit(false); 
    this.toggleToListAprovedEvent.emit(this.showAprovedListActive);
  }

  toggleReservesList(): void {
    if (!this.reservesListActive) {
      this.reservesListActive = true;
      this.showAprovedListActive = false;
    } else {
      this.reservesListActive = false;
    }
    this.toggleReservesListEvent.emit(this.reservesListActive);
    this.toggleToListAprovedEvent.emit(false);
  }

}
