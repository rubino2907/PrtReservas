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
  }

  showForm(): void {
    this.isFormEditReserveVisible = true; // Mostra o formulário
  }

  createReserve(reserve: Reserve): void {
    console.log("Reserva antes de ser enviado:", reserve);
  
    reserve.createdBy = this.cookieService.get('userName');
    reserve.changeDateTime = new Date();;
    reserve.creationDateTime = new Date();;
    reserve.state = "";
  
    this.reserveService
      .createReserve(reserve)
      .subscribe(
        (reserves: Reserve[]) => {
          console.log("Reserva criada com sucesso!", reserves);
          this.reservesUpdated.emit(reserves);
          this.isFormEditReserveVisible = false; // Esconde o formulário após criar a reserva com sucesso
        },
        (error) => {
          console.error("Erro ao criar Reserva:", error);
          if (error && error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                console.error(`Erro de validação no campo ${field}: ${validationErrors[field]}`);
              }
            }
          } else if (error && error.message) {
            console.error("Mensagem de erro:", error.message);
          }
          this.isFormEditReserveVisible = false; // Esconde o formulário se ocorrer um erro
        }
      );
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
