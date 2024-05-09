import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pedidosService/pending.service';
import { CookieService } from 'ngx-cookie-service';
import { Reserve } from '../../../models/reserve';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { UserService } from '../../../services/userServices/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetails } from '../../../models/UserModels/userDetails';

@Component({
  selector: 'app-aprove-pendings',
  templateUrl: './aprove-pendings.component.html',
  styleUrl: './aprove-pendings.component.css'
})
export class AprovePendingsComponent implements OnInit {
  @Input() pendings: Pending[] = [];
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  @Input() pendingsToEdit?: Pending;
  @Input() isFormEditPendingVisible: boolean = false;
  userDetails?: UserDetails;

  filteredPendings: Pending[] = [];
  isSearchingByCreatedBy: boolean = true;
  searchInput: string = '';

  // Variável para acompanhar a linha selecionada
  selectedPending: any = null;

  isDeleteConfirmationVisible: boolean = false;

  isSuccessPopupVisible: boolean = false;
  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  constructor(private cookieService: CookieService, 
    private snackBar: MatSnackBar, 
    private reserveService: ReserveService, 
    private pendantService: PendantService, 
    private userService: UserService,
    private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendingsByAproved()
      .subscribe((result: Pending[]) => {
        this.pendings = result;
        this.filteredPendings = result;
      });
  }

  filterPendings(): void {
    if (this.isSearchingByCreatedBy) {
      this.filteredPendings = this.pendings.filter(pending => pending.createdBy!.toLowerCase().includes(this.searchInput.toLowerCase()));
    } 
  }
  
  approvePending(pending: Pending): void {
    // Verifica se o estado do pedido não é 'APROVADO'
    if (pending.aproved !== 'APROVADO') {

      // Após a aprovação bem-sucedida, remover o pedido aprovado da lista de pendentes
      this.filteredPendings = this.filteredPendings.filter(item => item !== pending);

      // Verifica se a lista de pendentes está vazia após a filtragem
      if (this.filteredPendings.length === 0) {
          // Se não houver mais pendentes, emita um evento para atualizar a tabela
          this.pendingsUpdated.emit([]);
          this.isSuccessPopupVisible = true;
          this.isFormEditPendingVisible = false;
      }

        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!pending.vehicleType || !pending.matriculation || !pending.dateStart || !pending.dateEnd || !pending.description) {
            console.error("Todos os campos são obrigatórios.");
            this.openErrorPopup('Todos os campos são obrigatórios. Preencha todos os campos antes de enviar o pedido.');
            return; // Sair da função sem aprovar o pedido
        }

        // Verificar se a data final é posterior à data inicial
        if (new Date(pending.dateEnd) <= new Date(pending.dateStart)) {
            console.error("A data final deve ser posterior à data inicial.");
            this.openErrorPopup('A data final deve ser posterior à data inicial.');
            return; // Sair da função sem aprovar o pedido
        }

        // Verificar se a data de início e a data final estão no futuro
        const currentDate = new Date();
        if (new Date(pending.dateStart) < currentDate || new Date(pending.dateEnd) < currentDate) {
            console.error("Atenção datas ultrapassadas.");
            this.openErrorPopup('Atenção datas ultrapassadas.');
            return; // Sair da função sem aprovar o pedido
        }

        // Altera o estado do pedido para 'APROVADO'
        pending.aproved = 'APROVADO';
        pending.aprovedBy = this.cookieService.get('userName');

        // Envia a solicitação para atualizar o estado do pedido
        this.pendantService
            .updatePendings(pending)
            .subscribe(
                (pendants: Pending[]) => {
                  
                    // Emite o evento para informar que os pendentes foram atualizados
                    this.pendingsUpdated.emit(pendants);

                    // Verifica se o pedido foi aprovado
                    if (pending.aproved === 'APROVADO') {
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
                                    // Recarrega os pendentes após a aprovação do pedido
                                    this.loadPendings();
                                    // Fecha o formulário apenas se a aprovação for bem-sucedida
                                    this.isFormEditPendingVisible = false;
                                },
                                (error) => {
                                    console.error("Erro ao criar Reserva:", error);
                                    // Lógica de tratamento de erro aqui
                                }
                            );
                    }
                },
                (error) => {
                    console.error("Erro ao aprovar o pedido:", error);
                    this.openErrorPopup('Erro ao aprovar o pedido: ' + (error.error));
                    this.loadPendings();
                    this.isFormEditPendingVisible = false;
                }
            );
    }
  }

  editPending(pending: Pending): void {
    this.pendingsToEdit = pending;
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
    const createdBy = pending.createdBy;
  
    if (createdBy) {
      this.userService.getUserDetailsByCreatedBy(createdBy).subscribe(
        (userData: UserDetails) => {
          this.userDetails = userData;
          // Coloque o código HTML dentro deste bloco
        },
        (error) => {
          console.error('Ocorreu um erro ao buscar os detalhes do usuário:', error);
        }
      );
    } else {
      console.error('O campo createdBy está undefined.');
    }

    // Remova o código HTML fora deste bloco
  }

  fecharForm(): void {
    // Limpar os detalhes do usuário
    this.userDetails = undefined;

    // Limpar o pendingsToEdit
    this.pendingsToEdit = undefined;

    // Ocultar o formulário de edição
    this.isFormEditPendingVisible = false;
  }

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }
  
  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }

  openSuccessPopup(message: string): void {
    this.isSuccessPopupVisible = true;
    console.log('Popup de sucesso aberta com mensagem:', message);
    // Fecha o formulário apenas se a aprovação for bem-sucedida
    this.isFormEditPendingVisible = false;
  }


  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
    this.cdr.detectChanges(); // Atualiza a detecção de mudanças
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
    this.isDeleteConfirmationVisible = false;
    this.cdr.detectChanges(); // Atualiza a detecção de mudanças
  }
  
  recusePending(pending: Pending): void {
    // Verifica se o estado do pedido não é 'RECUSADO'
    if (pending.aproved !== 'RECUSADO') {
        // Altera o estado do pedido para 'RECUSADO'
        pending.aproved = 'RECUSADO';

        // Envia a solicitação para atualizar o estado do pedido
        this.pendantService
            .updatePendings(pending)
            .subscribe(
                (pendants: Pending[]) => {
                    // Emite o evento para informar que os pendentes foram atualizados
                    this.pendingsUpdated.emit(pendants);
                    // Recarrega os pendentes após a recusa do pedido
                    this.loadPendings();
                    this.openSuccessPopup('Pedido Recusado com sucesso!');
                    // Fecha o formulário apenas se a recusa for bem-sucedida
                    this.isFormEditPendingVisible = false;
                },
                (error) => {
                    console.error("Erro ao recusar o pedido:", error);
                    // Se ocorrer um erro na solicitação para recusar o pedido
                    // Exibe um toast com a mensagem de erro
                    this.snackBar.open('Erro ao recusar o pedido: ' + error.error, 'Fechar', {
                        duration: 5000 // Duração em milissegundos
                    });
                    
                    this.loadPendings()
                    this.isFormEditPendingVisible = false;
                }
            );
    } else {
        // Se o estado já for 'RECUSADO', não é necessário realizar mais nenhuma ação
        console.log('O pedido já está recusado.');
    }
}

  // Função para retornar a classe com base no estado do pedido
  getPendingStatusClass(status: string | undefined): string {
    if (status === 'APROVADO') {
      return 'approved';
    } else if (status === 'EM ESPERA') {
      return 'pending';
    } else if (status === 'NÃO APROVADO') {
      return 'not-approved';
    } else {
      return ''; // Retorna uma string vazia se o status for undefined
    }
  }

  sortByStartDate(): void {
    this.pendings.sort((a, b) => {
        // Check if dateStart is defined for both objects
        if (a.dateStart && b.dateStart) {
            const dateA = new Date(a.dateStart);
            const dateB = new Date(b.dateStart);
            return dateA.getTime() - dateB.getTime();
        }
        // If either dateStart is undefined, return 0 to maintain current order
        return 0;
    });
  }

  sortByMatriculation(): void {
    this.pendings.sort((a, b) => {
        // Check if matriculation is defined for both objects
        if (a.matriculation && b.matriculation) {
            // Convert matriculation to lowercase before comparison (optional)
            const matriculationA = a.matriculation.toLowerCase();
            const matriculationB = b.matriculation.toLowerCase();
            
            // Compare matriculation strings
            if (matriculationA < matriculationB) {
                return -1;
            } else if (matriculationA > matriculationB) {
                return 1;
            } else {
                return 0;
            }
        }
        // If either matriculation is undefined, return 0 to maintain current order
        return 0;
    });
}



}
