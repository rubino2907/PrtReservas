import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { CookieService } from 'ngx-cookie-service';
import { Pending } from '../../models/pending';
import { PendantService } from '../../services/pending.service';
import { ReserveService } from '../../services/reserve.service';
import { Reserve } from '../../models/reserve';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importando MatSnackBar para exibir mensagens de erro
import { Vehicle } from '../../models/vehicle';

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

  constructor(private cookieService: CookieService ,private pendantService: PendantService, private vehicleService: VehicleService, private reserveService: ReserveService, private userService: UserService, private snackBar: MatSnackBar) {}

  showForm(): void {
    this.isFormEditPendingVisible = true; // Mostra o formulário
  }

  loadMatriculations(vehicleType: string): void {
    this.vehicleService.getVehiclesByType(vehicleType).subscribe(
        (vehicles: Vehicle[]) => {
            // Filtrar matrículas não definidas e extrair as matrículas dos veículos retornados
            this.matriculations = vehicles
                .filter(vehicle => !!vehicle.matriculation)
                .map(vehicle => vehicle.matriculation!);
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
}

  createPending(newPending: Pending): void {
    console.log("Pendente antes de ser enviado:", newPending);

    newPending.createdBy = this.cookieService.get('userName');

    // Verificar se o usuário forneceu uma matrícula
    if (!newPending.matriculation) {
        // Se não houver matrícula especificada, selecionar automaticamente a primeira matrícula disponível
        if (this.matriculations.length > 0) {
            newPending.matriculation = this.matriculations[0]; // Selecionar a primeira matrícula disponível
        } else {
            // Se não houver matrículas disponíveis, exibir uma mensagem de erro ao usuário
            console.error("Nenhuma matrícula disponível.");
            this.snackBar.open('Impossível criar pedido. Nenhuma viatura está disponível.', 'Fechar', {
                duration: 5000, // Duração em milissegundos
            });
            return; // Sai do método sem criar o pendente
        }
    }

    newPending.changeDateTime = new Date(); // criando um novo objeto Date com a data atual
    newPending.creationDateTime = new Date(); // criando um novo objeto Date com a data atual
    newPending.aproved = "EM ESPERA";
    newPending.aprovedBy = this.cookieService.get('userName');
    
    this.pendantService
      .createPendingWithType(newPending)
      .subscribe(
        (pendants: Pending[]) => {
          console.log("Pendentes criados com sucesso!", pendants);
          this.pendingsUpdated.emit(pendants);
          // Limpar o formulário
          this.pending = new Pending(); // Ou qualquer outra forma de criar um novo objeto vazio
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
          // Exibir mensagem de erro
          this.snackBar.open('Impossível criar pedido. Nenhuma viatura está disponível para essa data // Viatura escolhida não Disponivel.', 'Fechar', {
            duration: 5000, // Duração em milissegundos
          });
        }
      );
  }

  updatePending(pending: Pending): void {
    pending.aprovedBy = this.cookieService.get('userName');
    this.pendantService
      .updatePendings(pending)
      .subscribe((pendants: Pending[]) => {
        this.pendingsUpdated.emit(pendants);
        this.isFormEditPendingVisible = false; // Esconde o formulário após a atualização bem-sucedida
        
        // Verifica se o pedido foi aprovado
        if (pending.aproved === 'APROVADO') { // Verifica se o pendente foi aprovado
          // Se aprovado, cria a reserva
          const reserve: Reserve = {
            createdBy: pending.createdBy,
            creationDateTime: pending.creationDateTime,
            changeDateTime: pending.changeDateTime,
            dateStart: pending.dateStart,
            dateEnd: pending.dateEnd,
            description: pending.description,
            matriculation: pending.matriculation,
            state: 'ATIVA',
            obs: ''
          };
          
          this.reserveService
            .createReserve(reserve)
            .subscribe(
              (reserves: Reserve[]) => {
                console.log("Reserva criada com sucesso!", reserves);
                // Se necessário, emita um evento para atualizar as reservas no componente pai
              },
              (error) => {
                console.error("Erro ao criar Reserva:", error);
                // Lide com os erros adequadamente
              }
            );
        }
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
