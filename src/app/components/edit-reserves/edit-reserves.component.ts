import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Reserve } from '../../models/reserve';
import { ReserveService } from '../../services/reserve.service';
import { VehicleService } from '../../services/vehicle.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-reserves',
  templateUrl: './edit-reserves.component.html',
  styleUrl: './edit-reserves.component.css'
})
export class EditReservesComponent {
  @Input() reserve?: Reserve;
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();
  isDeleteConfirmationVisible: boolean = false;
  matriculations: string[] = [];

  isFormEditReserveVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private cookieService: CookieService ,private reserveService: ReserveService, private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadMatriculations();
    this.isFormEditReserveVisible = true; // Mostra o formulário
  }

  showForm(): void {
    this.isFormEditReserveVisible = true; // Mostra o formulário
  }
  
  loadMatriculations(): void {
    this.vehicleService.getMatriculations().subscribe(
      (matriculations: string[]) => {
        this.matriculations = matriculations;
      },
      (error) => {
        console.error("Erro ao carregar as matrículas dos veículos:", error);
      }
    );
  }

  updateReserve(reserve: Reserve): void {
    this.reserveService
      .updateReserves(reserve)
      .subscribe((reserves: Reserve[]) => {
        this.reservesUpdated.emit(reserves);
        this.isFormEditReserveVisible = false; // Esconde o formulário após a atualização bem-sucedida
      });
  }

  deleteReserve(reserve: Reserve): void {
    this.reserveService
      .deleteReserves(reserve)
      .subscribe((reserves: Reserve[]) => {
        this.reservesUpdated.emit(reserves);
        this.isFormEditReserveVisible = false; // Esconde o formulário após excluir o usuário
      });
  }

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }


}
