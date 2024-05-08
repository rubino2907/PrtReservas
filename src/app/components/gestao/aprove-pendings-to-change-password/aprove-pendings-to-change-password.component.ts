import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PendingToPasswordChange } from '../../../models/pendingToPasswordChange';
import { UserService } from '../../../services/userServices/user.service';
import { UserDetails } from '../../../models/UserModels/userDetails';
import { PendingToChangePasswordService } from '../../../services/pedidosService/pending-to-change-password.service';
import { User } from '../../../models/UserModels/user';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-aprove-pendings-to-change-password',
  templateUrl: './aprove-pendings-to-change-password.component.html',
  styleUrl: './aprove-pendings-to-change-password.component.css'
})
export class AprovePendingsToChangePasswordComponent {
  @Input() pendings: PendingToPasswordChange[] = [];
  filteredPendings: PendingToPasswordChange[] = [];
  @Input() pendingsToEdit?: PendingToPasswordChange;
  @Input() isFormEditPendingVisible: boolean = false;
  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();
  userDetails?: UserDetails;
  isSuccessPopupVisible: boolean = false;

  wordpass: string = ''; // Nova senha
  confirmWordpass: string = ''; // Confirmação da nova senha
  newPassword: string = ''; // Confirmação da nova senha
  
  isDeleteConfirmationVisible: boolean = false;

  constructor(private userService: UserService,
    private pendantService: PendingToChangePasswordService,
    private cookieService: CookieService,
  ){}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendingsToChangePassword()
      .subscribe((result: PendingToPasswordChange[]) => {
        this.pendings = result;
        this.filteredPendings = result;
      });
  }

  editPending(pending: PendingToPasswordChange): void {
    this.pendingsToEdit = pending;
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
    const createdBy = pending.createdBy;

    // Limpar as variáveis newPassword e confirmPassword
    this.wordpass = '';
    this.confirmWordpass = '';
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

  changePassword(username: string): void {
    if (this.wordpass !== this.confirmWordpass) {
        alert('As senhas não coincidem.');
        return;
    }

    // Busca o usuário pelo nome de usuário
    this.userService.getUserByUsername(username).subscribe(
        (user: User) => {
            if (user) {
                console.log(user);
                // Atualiza a senha no objeto do usuário
                user.password = this.wordpass;

                // Chama o método para atualizar o usuário, incluindo a nova senha
                this.updateUser(user);

                // Elimina o pedido associado e envia a nova senha por e-mail
                this.deletePendingAndSendNewPassword();

                this.isFormEditPendingVisible = false;

                this.loadPendings();

                // Limpa os campos de nova senha e confirmação
                this.wordpass = '';
                this.confirmWordpass = '';

                this.openSuccessPopup('O utilizador foi atualizado com sucesso.');
            } else {
                alert('Usuário não encontrado.');
            }
        },
        (error) => {
            console.error('Ocorreu um erro ao buscar os detalhes do usuário:', error);
        }
    );
  }


  updateUser(user: User): void {
    if (this.pendingsToEdit && this.pendingsToEdit.createdBy) {
      user.userChanged = this.pendingsToEdit.createdBy;
      this.userService
        .updateUsers(user)
        .subscribe((users: User[]) => this.usersUpdated.emit(users));
    } else {
      console.error('Não é possível atualizar o usuário. O objeto pendingsToEdit ou createdBy está nulo.');
    }
  }

  openSuccessPopup(message: string): void {
    this.isSuccessPopupVisible = true;
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
  }

  deletePendingAndSendNewPassword(): void {
    console.log(this.wordpass);
    if (this.pendingsToEdit && this.pendingsToEdit.pendingToChangePasswordID !== undefined) {
        // Chame o método deletePendingToChangePassword sem o parâmetro newPassword
        this.pendantService.deletePendingToChangePassword(this.pendingsToEdit.pendingToChangePasswordID, this.wordpass)
            .subscribe(() => {
                console.log('Pedido eliminado com sucesso.');
                // Enviar a nova senha por e-mail
                this.sendNewPasswordByEmail(this.userDetails?.email || '', this.wordpass);
            }, (error) => {
                console.error('Erro ao eliminar o pedido:', error);
            });
    } else {
        console.error('Não é possível excluir o pedido. O objeto pendingsToEdit ou pendingToChangePasswordID está nulo ou indefinido.');
    }
  }
  



  sendNewPasswordByEmail(email: string, newPassword: string): void {
      // Lógica para enviar a nova senha por e-mail
      console.log(`Nova senha enviada para ${email}: ${newPassword}`);
      // Adicione aqui a lógica para enviar a nova senha por e-mail usando o serviço de e-mail
  }


}
