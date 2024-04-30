import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { CookieService } from 'ngx-cookie-service';
import { VehicleService } from '../../../services/vehicle.service';
import { TypeVehicleService } from '../../../services/typeVehicle.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';

@Component({
  selector: 'app-list-user-pendings',
  templateUrl: './list-user-pendings.component.html',
  styleUrls: ['./list-user-pendings.component.css']
})
export class ListUserPendingsComponent implements OnInit {
  pendings: Pending[] = [];
  sortColumn: string = 'aproved';
  sortDirection: string = 'desc'; // 'asc' para ascendente, 'desc' para descendente
  @Output() pendingsUpdated: EventEmitter<any> = new EventEmitter();
  
  isDeleteConfirmationVisible: boolean = false;

  matriculations: string[] = []; // Array para armazenar as matrículas

  filteredPendings: any[] = []; // Lista filtrada para exibição
  selectedMatricula: string = '';
  startDate: string = '';
  endDate: string = '';

  isSuccessPopupVisible: boolean = false;
  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  selectedVehicleType: string = ''; // Armazena o tipo de viatura selecionado

  vehicleType: string[] = []; // Array para armazenar os tipos

  constructor(private cookieService: CookieService, 
    private typeVehicleService: TypeVehicleService, 
    private vehicleService: VehicleService, 
    private pendantService: PendantService,
    private reserveService: ReserveService) { }

  ngOnInit(): void {
    // Chame o método do serviço para obter os pendentes do usuário
    this.getPendingsByCurrentUser();
    this.loadTypeOfVehicles();
  }

  clearDate(field: string) {
    if (field === 'startDate') {
        this.startDate = ''; // Alteração aqui
    } else if (field === 'endDate') {
        this.endDate = ''; // Alteração aqui
    }
    this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
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


  applyFilters(): void {
    // Converta as strings de data para objetos Date para comparação
    let startDate = this.startDate ? new Date(this.startDate) : null;
    let endDate = this.endDate ? new Date(this.endDate) : null;

    this.filteredPendings = this.pendings.filter(pending => {
      // Verificação de matrícula
      const matchMatricula = this.selectedMatricula ? pending.matriculation === this.selectedMatricula : true;

      // Conversão da data do pedido para objeto Date
      const pendingStartDate = pending.dateStart ? new Date(pending.dateStart) : new Date();
      const pendingEndDate = pending.dateEnd ? new Date(pending.dateEnd) : new Date();


      // Verificação de datas
      const matchStartDate = startDate ? pendingStartDate >= startDate : true;
      const matchEndDate = endDate ? pendingEndDate <= endDate : true;

      return matchMatricula && matchStartDate && matchEndDate;
    });
  }

  // Método para obter os pendentes do usuário atual
  getPendingsByCurrentUser(): void {
    // Substitua 'currentUser' pelo identificador do usuário atual
    const currentUser = this.cookieService.get('userName'); // Exemplo: 'username'
    
    this.pendantService.getPendingsByCreatedBy(currentUser).subscribe(
      (pendings: Pending[]) => {
        // Ordenar os pendentes por 'approved'
        this.pendings = pendings.sort((a, b) => {
          // Define a ordem dos estados: 'EM ESPERA', 'APROVADO', 'RECUSADO'
          const order = ['EM ESPERA', 'APROVADO', 'RECUSADO'];
          return order.indexOf(a.aproved!) - order.indexOf(b.aproved!);
        });
        
        this.filteredPendings = [...this.pendings]; // Inicialize a lista filtrada com todos os pendentes
        this.applyFilters(); // Aplica qualquer filtro inicial se necessário
      },
      error => {
        console.error('Erro ao carregar pendentes:', error);
      }
    );
    
  }

  updatePendingList(pendings: Pending[]): void {
    this.pendings = pendings;
    this.filteredPendings = [...this.pendings];
  }

  updatePending(pending: Pending): void {
    // Verificar se as datas são válidas
    const startDate = new Date(pending.dateStart!);
    const endDate = new Date(pending.dateEnd!);
    const today = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Datas inválidas fornecidas.");
        this.openErrorPopup('Datas inválidas fornecidas.');
        return; // Aborta a atualização se as datas forem inválidas
    }

    // Verificar se a data final não é anterior à data inicial
    if (endDate < startDate) {
        console.error("A data final não pode ser anterior à data inicial.");
        this.openErrorPopup('A data final não pode ser anterior à data inicial.');
        return; // Aborta a atualização se a data final for anterior à data inicial
    }

    // Verificar se a data inicial não é anterior à data atual
    if (startDate < today) {
        console.error("A data inicial não pode ser anterior à data atual.");
        this.openErrorPopup('A data inicial não pode ser anterior à data atual.');
        return; // Aborta a atualização se a data inicial for anterior à data atual
    }

    // Verificar a disponibilidade da viatura para o período atualizado
    this.reserveService.getReservesByCreatedBy(pending.createdBy!).subscribe(
        (reserves: Reserve[]) => {
            // Verificar se há reservas ativas que se sobrepõem ao período do pedido atualizado
            const overlappingReserves = reserves.some(reserve =>
                reserve.state === 'ATIVA' &&
                reserve.dateStart && reserve.dateEnd && // Verificar se reserve.dateStart e reserve.dateEnd não são undefined
                new Date(pending.dateStart!) <= new Date(reserve.dateEnd) &&
                new Date(pending.dateEnd!) >= new Date(reserve.dateStart)
            );

            // Verificar se a viatura associada ao pedido está disponível para o período atualizado
            if (overlappingReserves) {
                console.error("A viatura não está disponível para o período atualizado.");
                this.openErrorPopup('A viatura não está disponível para o período atualizado.');
            } else {
              // Simulação da lógica de atualização do pedido
              // Substitua isso com sua lógica real de atualização do pedido
              this.pendantService.updatePendings(pending).subscribe(
                  (updatedPending: Pending[]) => {
                      // Após a atualização bem-sucedida, exibir a popup de sucesso
                      this.openSuccessPopup('Pedido atualizado com sucesso!');
                  },
                  (error) => {
                      console.error("Erro ao atualizar o pedido:", error);
                      // Lide com os erros adequadamente
                  }
              );
          }
      },
      (error) => {
          console.error("Erro ao buscar reservas:", error);
          // Lide com os erros adequadamente
      }
  );
}



  openSuccessPopup(message: string): void {
    this.isSuccessPopupVisible = true;
    console.log('Popup de sucesso aberta com mensagem:', message);
  }


  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
    this.isDeleteConfirmationVisible = false;
    this.closeEditPopup();
  }

  cancelPending(pending: Pending): void {
    // Primeiro, obtenha todas as reservas
    this.reserveService.getReserves().subscribe(
        (reserves: Reserve[]) => {
            // Filtrar as reservas para encontrar a correspondente ao pedido
            const matchingReserve = reserves.find(reserve =>
                reserve.state === 'ATIVA' &&
                reserve.matriculation === pending.matriculation &&
                new Date(reserve.dateStart!).getTime() === new Date(pending.dateStart!).getTime() &&
                new Date(reserve.dateEnd!).getTime() === new Date(pending.dateEnd!).getTime()
            );

            if (matchingReserve) {
                // Excluir a reserva encontrada
                this.reserveService.deleteReserves(matchingReserve).subscribe(
                  () => {
                              console.log("Reserva excluída com sucesso!");
                              console.log("Pedido cancelado com sucesso!");
                              this.openSuccessPopup('Pedido cancelado com sucesso!');
                              this.getPendingsByCurrentUser();
                  },
                  (error) => {
                      console.error("Erro ao excluir a reserva:", error);
                      this.openErrorPopup('Erro ao excluir a reserva: ' + (error.error || "Erro desconhecido"));
                  }
              );
            } else {
                console.error("Não foi encontrada uma reserva ativa correspondente ao pedido.");
                this.openErrorPopup('Não foi encontrada uma reserva ativa correspondente ao pedido.'); // Exibir popup de erro aqui
            }
        },
        (error) => {
            console.error("Erro ao buscar reservas:", error);
            this.openErrorPopup('Não foi possível buscar as reservas.'); // Exibir popup de erro aqui
        }
    );
}

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }



  // Método para ordenar a tabela com base no estado de aprovação
  sortTableByApproval(): void {
    // Alterne a direção da ordenação
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    // Atualize a coluna de ordenação para 'aproved'
    this.sortColumn = 'aproved';

    // Defina a ordem desejada dos estados
    const order = ['EM ESPERA', 'APROVADO', 'RECUSADO'];

    // Classifique os pendentes com base no estado de aprovação e na direção da ordenação
    this.filteredPendings.sort((a, b) => {
        // Verifique se 'a.aproved' e 'b.aproved' estão definidos
        if (a.aproved !== undefined && b.aproved !== undefined) {
            const indexA = order.indexOf(a.aproved);
            const indexB = order.indexOf(b.aproved);
            
            // Se ambos os estados estiverem na ordem, classifique com base nessa ordem
            if (indexA !== -1 && indexB !== -1) {
                if (this.sortDirection === 'asc') {
                    return indexA - indexB;
                } else {
                    return indexB - indexA;
                }
            }
            // Se apenas um estado estiver na ordem, coloque-o antes
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
        }
        // Se 'a.aproved' ou 'b.aproved' não forem definidos ou não estiverem na ordem, mantenha a ordem atual
        return 0;
    });
  }

  // Função para retornar a classe com base no estado do pedido
  getPendingStatusClass(status: string | undefined): string {
    if (status === 'APROVADO') {
      return 'approved';
    } else if (status === 'EM ESPERA') {
      return 'pending';
    } else if (status === 'RECUSADO') {
      return 'not-approved';
    } else {
      return ''; // Retorna uma string vazia se o status for undefined
    }
  }

  // No seu componente TypeScript
  sortTableByStartDateIcon() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    // Aqui você deve implementar a lógica para ordenar o array 'filteredPendings' com base na data de início
    // Você pode usar a função de ordenação do JavaScript, por exemplo:
    this.filteredPendings.sort((a, b) => {
        const dateA = new Date(a.dateStart).getTime();
        const dateB = new Date(b.dateStart).getTime();
        
        if (this.sortDirection === 'asc') {
            return dateA - dateB;
        } else {
            return dateA - dateB;
        }
    });
  }

  // No seu componente TypeScript
  selectedPending: any; // Adicione uma propriedade para armazenar o pedido selecionado
  isEditPopupVisible: boolean = false;


  openEditPopup(pending: any) {
    this.selectedPending = pending; // Armazena o pedido selecionado
    // Define a matrícula selecionada com base no pedido selecionado
    this.selectedMatricula = pending.matriculation;
    // Abre o popup de edição
    this.isEditPopupVisible = true; 
  }



  closeEditPopup() {
    this.isEditPopupVisible = false;
}

}
