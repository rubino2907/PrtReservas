import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { CookieService } from 'ngx-cookie-service';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importando MatSnackBar para exibir mensagens de erro
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { ChangeDetectorRef } from '@angular/core';
import { TypeVehicleService } from '../../../services/typeVehicle.service';

@Component({
  selector: 'app-edit-pendants',
  templateUrl: './edit-pendants.component.html',
  styleUrls: ['./edit-pendants.component.css']
})
export class EditPendantsComponent{
  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  isDeleteConfirmationVisible: boolean = false;
  matriculations: string[] = [];
  
  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  isFormEditPendingVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  success: boolean = false; // Propriedade para indicar se a criação do pedido foi bem-sucedida

  vehicleType: string[] = []; // Array para armazenar os tipos
  constructor(private cookieService: CookieService, private typeVehicleService: TypeVehicleService, private cdr: ChangeDetectorRef ,private pendantService: PendantService, private vehicleService: VehicleService, private reserveService: ReserveService, private userService: UserService, private snackBar: MatSnackBar) {}

  showForm(): void {
    this.isFormEditPendingVisible = true; // Mostra o formulário
  }

  ngOnInit(): void {
    this.loadTypeOfVehicles();
  }

  loadTypeOfVehicles(): void {
    this.typeVehicleService.getTypeOfVehicle().subscribe(
        (vehicleType: string[]) => {
            // Você pode usar as matriculas diretamente aqui
            this.vehicleType = vehicleType;
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
  }

  loadMatriculations(vehicleType: string): void {
    if (!vehicleType) {
        this.matriculations = [];
        return;
    }

    this.vehicleService.getVehiclesByType(vehicleType).subscribe(
        (vehicles: Vehicle[]) => {
            // Ensure only non-undefined matriculations are included
            this.matriculations = vehicles.map(vehicle => vehicle.matriculation).filter((matriculation): matriculation is string => matriculation !== null && matriculation !== undefined);
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
        }
    );
  }

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }

  createPending(newPending: Pending): void {
    // Verificar se todos os campos obrigatórios estão preenchidos
    if ( !newPending.vehicleType || !newPending.matriculation || !newPending.dateStart || !newPending.dateEnd || !newPending.description) {
      // Se algum campo estiver vazio, exibir uma mensagem de erro ao usuário
      console.error("Todos os campos são obrigatórios.");
      this.openErrorPopup('Todos os campos são obrigatórios. Preencha todos os campos antes de enviar o pedido.');
      return; // Sai do método sem criar o pendente
    }

    // Verificar se a data final é posterior à data inicial
    if (new Date(newPending.dateEnd) <= new Date(newPending.dateStart)) {
      console.error("A data final deve ser posterior à data inicial.");
      this.openErrorPopup('A data final deve ser posterior à data inicial.');
      return; // Sai do método sem criar o pendente
    }

    // Verificar se a data de início e a data final estão no futuro
    const currentDate = new Date();
    if (new Date(newPending.dateStart) < currentDate || new Date(newPending.dateEnd) < currentDate) {
        console.error("Atenção datas ultrapassadas.");
        this.openErrorPopup('Atenção datas ultrapassadas.');
        return;
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
        this.openErrorPopup('Impossível criar pedido. A matrícula fornecida não está disponível.');
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
            this.errorMessage = errorMessage; // Defina a mensagem de erro específica
            this.openErrorPopup(errorMessage); // Exibe a popup de erro
          } else {
            // Se não houver corpo de resposta, use uma mensagem de erro padrão
            console.error("Mensagem de erro:", "Erro do lado do cliente ao criar pendente.");
            this.errorMessage = 'Erro ao criar pendente. Tente novamente mais tarde.'; // Mensagem de erro padrão
            this.openErrorPopup(this.errorMessage); // Exibe a popup de erro
          }
        }
      );

      console.log(this.errorMessage)
  }

  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
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
