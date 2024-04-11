import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../../models/UserModels/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  isDeleteConfirmationVisible: boolean = false;
  isChangePasswordVisible: boolean = false; // Variável para controlar a visibilidade da popup de alteração de senha
  newPassword: string = ''; // Nova senha
  confirmPassword: string = ''; // Confirmação da nova senha
  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  isFormVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private userService: UserService, private cookieService: CookieService) {}

  ngOnInit(): void {}

  showForm(): void {
    this.isFormVisible = true; // Mostra o formulário
  }

  updateUser(user: User): void {
    user.userChanged = this.cookieService.get('userName');
    this.userService
      .updateUsers(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  deleteUser(user: User): void {
    this.userService
      .deleteUsers(user)
      .subscribe((users: User[]) => {
        this.usersUpdated.emit(users);
        this.isFormVisible = false; // Esconde o formulário após excluir o usuário
      });
  }

  createUser(user: User): void {
    console.log("Dados do usuário antes de serem enviados:", user); // Adiciona um log para mostrar os dados do usuário antes de enviar a solicitação
  
    user.createdBy = this.cookieService.get('userName');
    user.canApproveReservations = true;
    user.changeDateTime = "";
    user.creationDateTime = "";
    user.token = '';
  
    console.log("Usuário criado por:", user.createdBy); // Adiciona um log para mostrar quem está criando o usuário
  
    this.userService
      .createUsers(user)
      .subscribe(
        (users: User[]) => {
          console.log("Resposta do servidor ao criar usuário:", users); // Adiciona um log para mostrar a resposta do servidor ao criar o usuário
          this.usersUpdated.emit(users);
          console.log("Usuário criado com sucesso!", users);
          this.isFormVisible = false; // Esconde o formulário após criar o usuário com sucesso
        },
        (error) => {
          console.error("Erro ao criar usuário:", error); // Adiciona um log para mostrar qualquer erro ao criar o usuário
        }
      );
  }
  
  
  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }
  
  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }

  showChangePassword(): void {
    this.isChangePasswordVisible = true; // Mostra a popup de alteração de senha
  }

  changePassword(): void {
    if (this.newPassword === this.confirmPassword && this.user) { // Verifica se user não é undefined
        // Atualiza a senha no objeto do usuário
        this.user.password = this.newPassword;

        // Chama o método para atualizar o usuário, incluindo a nova senha
        this.updateUser(this.user);

        // Limpa os campos de nova senha e confirmação
        this.newPassword = '';
        this.confirmPassword = '';

        // Fecha a popup de alteração de senha
        this.isChangePasswordVisible = false;

        console.log('Password alterada com sucesso!');
    } else {
        console.log('As Password não coincidem ou o usuário não está definido. Por favor, tente novamente.');
    }
  }

  // No seu componente TypeScript

  togglePasswordVisibility(fieldId: string) {
    const field = document.getElementById(fieldId);
    if (field) {
        if (field.getAttribute('type') === 'password') {
            field.setAttribute('type', 'text');
        } else {
            field.setAttribute('type', 'password');
        }
    }
  }

  cancelChangePassword(): void {
    this.isChangePasswordVisible = false; // Fecha a popup de alteração de senha
  }
}
