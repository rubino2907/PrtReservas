import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { CookieService } from 'ngx-cookie-service';
import { Reserve } from '../../../models/reserve';
import { ReserveService } from '../../../services/reserve.service';
import { UserService } from '../../../services/user.service';
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
  // Variável para acompanhar a linha selecionada
  selectedPending: any = null;

  isDeleteConfirmationVisible: boolean = false;

  constructor(private cookieService: CookieService, private snackBar: MatSnackBar, private reserveService: ReserveService, private pendantService: PendantService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendingsByAproved()
      .subscribe((result: Pending[]) => {
        this.pendings = result;
      });
  }

  approvePending(pending: Pending): void {
    // Verifica se o estado do pedido não é 'APROVADO'
    if (pending.aproved !== 'APROVADO') {
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
                                    // Se a reserva não puder ser criada devido à indisponibilidade da matrícula
                                    if (error.error === "Cannot approve the pending. The user already has an active reservation in the desired period.") {
                                        // Exibe um toast com a mensagem de erro
                                        this.snackBar.open('Impossível criar a reserva. Viatura indisponível.', 'Fechar', {
                                            duration: 5000 // Duração em milissegundos
                                        });
                                    } else {
                                        // Se ocorrer outro tipo de erro
                                        // Exibe um toast com o erro
                                        this.snackBar.open('Erro ao criar reserva: ' + error.error, 'Fechar', {
                                            duration: 5000 // Duração em milissegundos
                                        });
                                    }
                                }
                            );
                    }
                },
                (error) => {
                    console.error("Erro ao aprovar o pedido:", error);
                    // Se ocorrer um erro na solicitação para aprovar o pedido
                    // Exibe um toast com a mensagem de erro
                    this.snackBar.open('Erro ao aprovar o pedido: ' + error.error, 'Fechar', {
                        duration: 5000 // Duração em milissegundos
                    });
                    
                    this.loadPendings()
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
