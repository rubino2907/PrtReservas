import { Component, Input, OnInit } from '@angular/core';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';
import { UserService } from '../../../services/user.service';
import { UserDetails } from '../../../models/userDetails';

@Component({
  selector: 'app-list-pendants',
  templateUrl: './list-pendants.component.html',
  styleUrls: ['./list-pendants.component.css']
})
export class ListPendantsComponent implements OnInit {

  @Input() pendings: Pending[] = [];
  @Input() pendingsToEdit?: Pending;
  @Input() isFormEditPendingVisible: boolean = false;
  userDetails?: UserDetails;

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

  
}
