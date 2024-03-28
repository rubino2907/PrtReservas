import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { Reserve } from '../../../models/reserve';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { VehicleService } from '../../../services/vehicle.service';
import { PendantService } from '../../../services/pending.service';
import { Vehicle } from '../../../models/vehicle';

@Component({
  selector: 'app-create-reserva-schedule',
  templateUrl: './create-reserva-schedule.component.html',
  styleUrl: './create-reserva-schedule.component.css'
})
export class CreateReservaScheduleComponent implements OnInit{
  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  matriculations: string[] = [];
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();
  @Output() matriculationSelected = new EventEmitter<string>(); // Evento de saída para a matrícula selecionada

  constructor(private vehicleService: VehicleService, private pendantService: PendantService, private cookieService: CookieService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // Método para emitir o evento de saída quando uma matrícula é selecionada
  onSelectMatriculation(matriculation: string): void {
    this.matriculationSelected.emit(matriculation);
  }

  updatePending() {
    // Atualiza o objeto pending com os valores selecionados
    if (this.pending) {
      this.pending = {
        ...this.pending,
        vehicleType: this.pending.vehicleType,
        matriculation: this.pending.matriculation,
        // Outros campos do objeto pending, se houver
      };
    }
  }

  loadMatriculations(vehicleType: string): void {
    this.vehicleService.getVehiclesByType(vehicleType).subscribe(
        (vehicles: Vehicle[]) => {
            // Filtrar matrículas não definidas e extrair as matrículas dos veículos retornados
            this.matriculations = vehicles
                .filter(vehicle => !!vehicle.matriculation)
                .map(vehicle => vehicle.matriculation!);
            // Atualizar o objeto pending após carregar as matrículas
            this.updatePending();
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


}
