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
      newPending.matriculation = ""; // Atribuir uma string vazia à matrícula
    } else {
      // Se o usuário fornecer uma matrícula, verificar se está disponível
      if (!this.matriculations.includes(newPending.matriculation)) {
        // Se a matrícula não estiver disponível, exibir uma mensagem de erro ao usuário
        console.error("A matrícula fornecida não está disponível.");
        this.snackBar.open('Impossível criar pedido. A matrícula fornecida não está disponível.', 'Fechar', {
          duration: 5000, // Duração em milissegundos
          panelClass: ['center-snackbar'] // Aplicando a classe CSS personalizada
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
          if (error.error) {
            // Verifique se há um corpo de resposta contendo detalhes do erro
            const errorMessage = error.error;
            console.error("Mensagem de erro:", errorMessage);
            this.snackBar.open(errorMessage, 'Fechar', {
              duration: 5000,
            });
          } else {
            // Se não houver corpo de resposta, use uma mensagem de erro padrão
            console.error("Mensagem de erro:", "Erro do lado do cliente ao criar pendente.");
            this.snackBar.open('Erro ao criar pendente. Tente novamente mais tarde.', 'Fechar', {
              duration: 5000, // Duração em milissegundos
            });
          }
        }      
      );
  }
  
  validateDates(): boolean {
    // Verifica se this.pending não é nulo e se as datas estão definidas
    if (this.pending && this.pending.dateStart && this.pending.dateEnd) {
      // Verifica se a data de início é antes da data de fim
      return new Date(this.pending.dateStart) < new Date(this.pending.dateEnd);
    } else {
      // Se alguma das datas não estiver definida ou this.pending for nulo, retorna falso
      return false;
    }
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
