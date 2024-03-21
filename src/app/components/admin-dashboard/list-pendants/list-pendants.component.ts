import { Component, Input, OnInit } from '@angular/core';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';
import { UserService } from '../../../services/user.service';
import { UserDetails } from '../../../models/userDetails';

@Component({
  selector: 'app-list-pendants',
  templateUrl: 'list-pendants.component.html', // Apenas o nome do arquivo
  styleUrls: ['./list-pendants.component.css']
})

export class ListPendantsComponent implements OnInit {

  @Input() pendings: Pending[] = [];
  @Input() pendingsToEdit?: Pending;
  @Input() isFormEditPendingVisible: boolean = false;
  userDetails?: UserDetails;
  // Variável para acompanhar a linha selecionada
  selectedPending: any = null;

  constructor(private pendantService: PendantService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendings()
      .subscribe((result: Pending[]) => {
        this.pendings = result;
      }, error => {
        console.error('Error fetching pendings:', error);
      });

    this.isFormEditPendingVisible = false;
  }

  initNewPending(): void {
    // Limpar os detalhes do usuário
    this.userDetails = undefined;
    this.pendingsToEdit = this.isFormEditPendingVisible ? undefined : new Pending();
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
  
    // Chama o serviço para obter a lista atualizada de pendentes após adicionar um novo pendente
    this.pendantService.getPendings().subscribe((result: Pending[]) => {
      this.pendings = result;
      console.log('Pendings after addition:', this.pendings);

    });
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

  

  updatePendingList(pendings: Pending[]): void {
    this.pendings = pendings;
    this.isFormEditPendingVisible = false;
  }

  fecharForm(): void {
    // Limpar os detalhes do usuário
    this.userDetails = undefined;

    // Limpar o pendingsToEdit
    this.pendingsToEdit = undefined;

    // Ocultar o formulário de edição
    this.isFormEditPendingVisible = false;
  }

  // Função para selecionar a linha clicada
  selectPending(pending: any) {
    this.selectedPending = pending;
    console.log('Selected Pending:', this.selectedPending); // Adicione este console log para verificar se a linha está sendo selecionada corretamente
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

  
  
}
