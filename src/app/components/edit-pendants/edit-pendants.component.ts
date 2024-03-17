import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { VehicleService } from '../../services/vehicle.service';
import { CookieService } from 'ngx-cookie-service';
import { Pending } from '../../models/pending';
import { PendantService } from '../../services/pending.service';

@Component({
  selector: 'app-edit-pendants',
  templateUrl: './edit-pendants.component.html',
  styleUrls: ['./edit-pendants.component.css']
})
export class EditPendantsComponent {
  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  matriculations: string[] = [];

  isFormEditPendingVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private cookieService: CookieService ,private pendantService: PendantService, private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadMatriculations();
  }

  showForm(): void {
    this.isFormEditPendingVisible = true; // Mostra o formulário
  }

  createPending(newPending: Pending): void {
    console.log("Pendente antes de ser enviado:", newPending);
    
    newPending.createdBy = this.cookieService.get('userName');
    newPending.changeDateTime = "";
    newPending.creationDateTime = "";
    newPending.aproved = false;
    newPending.aprovedBy = this.cookieService.get('userName');
    
    this.pendantService
      .createPending(newPending)
      .subscribe(
        (pendants: Pending[]) => {
          console.log("Pendentes criados com sucesso!", pendants);
          this.pendingsUpdated.emit(pendants);
          this.isFormEditPendingVisible = false; // Esconde o formulário após criar os pendentes com sucesso
        },
        (error) => {
          console.error("Erro ao criar Pendentes:", error);
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
          this.isFormEditPendingVisible = false; // Esconde o formulário se ocorrer um erro
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

  updatePending(pending: Pending): void {
    this.pendantService
      .updatePendings(pending)
      .subscribe((pendants: Pending[]) => {
        this.pendingsUpdated.emit(pendants);
        this.isFormEditPendingVisible = false; // Esconde o formulário após a atualização bem-sucedida
      });
  }

  deletePending(pending: Pending): void {
    this.pendantService
      .deletePendings(pending)
      .subscribe((pendants: Pending[]) => {
        this.pendingsUpdated.emit(pendants);
        this.isFormEditPendingVisible = false; // Esconde o formulário após excluir o pendente
      });
  }
}
