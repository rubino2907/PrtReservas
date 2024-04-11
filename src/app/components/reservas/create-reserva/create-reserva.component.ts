import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importando MatSnackBar para exibir mensagens de erro
import { Vehicle } from '../../../models/VehicleModels/vehicle';

@Component({
  selector: 'app-create-reserva',
  templateUrl: './create-reserva.component.html',
  styleUrls: ['./create-reserva.component.css']
})
export class CreateReservaComponent  implements OnInit{

  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  matriculations: string[] = [];
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();
  success: boolean = false; // Propriedade para indicar se a criação do pedido foi bem-sucedida

  constructor(private vehicleService: VehicleService, private pendantService: PendantService, private cookieService: CookieService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
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

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!newPending.matriculation || !newPending.dateStart || !newPending.dateEnd || !newPending.description) {
        // Se algum campo estiver vazio, exibir uma mensagem de erro ao usuário
        console.error("Todos os campos são obrigatórios.");
        this.snackBar.open('Todos os campos são obrigatórios. Preencha todos os campos antes de enviar o pedido.', 'Fechar', {
            duration: 5000, // Duração em milissegundos
            panelClass: ['center-snackbar'] // Aplicando a classe CSS personalizada
        });
        return; // Sai do método sem criar o pendente
    }

    // Verificar se a data final é posterior à data inicial
    if (new Date(newPending.dateEnd) <= new Date(newPending.dateStart)) {
        console.error("A data final deve ser posterior à data inicial.");
        this.snackBar.open('A data final deve ser posterior à data inicial.', 'Fechar', {
            duration: 5000, // Duração em milissegundos
            panelClass: ['center-snackbar'] // Aplicando a classe CSS personalizada
        });
        return; // Sai do método sem criar o pendente
    }

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
                this.success = true; // Define 'success' como true quando o pedido é criado com sucesso
                this.pendingsUpdated.emit(pendants);
                // Limpar o formulário
                this.pending = new Pending(); // Ou qualquer outra forma de criar um novo objeto vazio

                // Limpar as mensagens de erro
                this.snackBar.dismiss();
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
