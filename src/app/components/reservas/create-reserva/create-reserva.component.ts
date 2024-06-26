import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';
import { PendantService } from '../../../services/pedidosService/pending.service';
import { Pending } from '../../../models/pending';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importando MatSnackBar para exibir mensagens de erro
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';

@Component({
  selector: 'app-create-reserva',
  templateUrl: './create-reserva.component.html',
  styleUrls: ['./create-reserva.component.css']
})
export class CreateReservaComponent implements OnInit {

  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  matriculations: string[] = [];
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();
  success: boolean = false; // Propriedade para indicar se a criação do pedido foi bem-sucedida
  isSuccessPopupVisible: boolean = false;
  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  vehicleType: string[] = []; // Array para armazenar os tipos
  constructor(private vehicleService: VehicleService, private typeVehicleService: TypeVehicleService, private pendantService: PendantService, private cookieService: CookieService, private snackBar: MatSnackBar) { }

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

          // Exibir a popup de sucesso
          this.openSuccessPopup('O pedido foi submetido com sucesso.');

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

  openSuccessPopup(message: string): void {
    this.isSuccessPopupVisible = true;
  }

  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
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

}
