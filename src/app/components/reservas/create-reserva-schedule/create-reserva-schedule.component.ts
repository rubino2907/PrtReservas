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
  styleUrls: ['./create-reserva-schedule.component.css']
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

}
