import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebarServices/sidebar.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  showRelatoriosReservas: boolean = false;
  showRelatoriosPedidos: boolean = false;

  constructor(private sidebarService: SidebarService){}

  ngOnInit(): void {
    
  }

  toggleReservesList(showRelatoriosReservasListActive: boolean): void {
    this.showRelatoriosReservas = showRelatoriosReservasListActive;
    this.showRelatoriosPedidos = !showRelatoriosReservasListActive;
  }

  toggleToAprovedList(showRelatoriosPedidosListActive: boolean) : void {
    this.showRelatoriosPedidos = showRelatoriosPedidosListActive;
    this.showRelatoriosReservas = !showRelatoriosPedidosListActive;
  }

}
