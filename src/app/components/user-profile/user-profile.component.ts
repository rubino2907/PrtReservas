import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarService } from '../../services/sidebarServices/sidebar.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/UserModels/user';
import { UserService } from '../../services/userServices/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  @Input() user?: User;
  isChangePasswordVisible: boolean = false; // Variável para controlar a visibilidade da popup de alteração de senha

  isSuccessPopupVisible: boolean = false;
  isDeleteConfirmationVisible: boolean = false;
  showUserList: boolean = false;
  showOptions: boolean = false; // Controla a visibilidade das opções da barra lateral
  userName: string = ''; // Variável para armazenar o nome de usuário
  newPassword: string = ''; // Nova senha
  confirmPassword: string = ''; // Confirmação da nova senha
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private sidebarService: SidebarService, 
    private cookieService: CookieService,
    private userService: UserService ){}

  ngOnInit(): void {
    // Ocultar as opções da barra lateral ao entrar na página da dashboard
    this.sidebarService.hideOptions();
    // Definir showOptions como true para exibir as opções da barra lateral
    this.showOptions = true;
    // Obtém o nome de usuário do cookie ao inicializar o componente
    this.userName = this.cookieService.get('userName'); // Substitua 'userName' pelo nome do seu cookie

    // Chame o método getUserByUsername ao inicializar o componente
    this.userService.getUserByUsername(this.userName).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('Erro ao obter usuário:', error);
      }
    );
  }

  showChangePassword(): void {
    this.isChangePasswordVisible = true; // Mostra a popup de alteração de senha
  }

  saveUser(user: User): void {
    // Obtém o nome de usuário do cookie ao inicializar o componente
    this.userName = this.cookieService.get('userName'); // Substitua 'userName' pelo nome do seu cookie
    console.log('Nome de usuário do cookie:', this.userName);
    if (this.user && this.userName) {
      console.log('Dados do usuário:', this.user);
      this.userService.updateUsers(user).subscribe(
        (updatedUsers: User[]) => {
          this.usersUpdated.emit(updatedUsers);
          this.openSuccessPopup('Foi atualizado com sucesso.');
          console.log('Update Users:',updatedUsers);
          // Aqui você pode adicionar qualquer lógica adicional após a atualização do usuário
        },
        (error) => {
          console.error('Erro ao atualizar usuário:', error);
          // Aqui você pode lidar com o erro, por exemplo, exibindo uma mensagem para o usuário
        }
      );
    }
  }


  changePassword(): void {
    if (!this.isValidPassword(this.newPassword)) {
      alert('A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e um caractere especial.');
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
  
    const userName = this.cookieService.get('userName'); // Obter o userName dos cookies
    if (!userName) {
      alert('Nome de usuário não encontrado nos cookies. Por favor, faça o login novamente.');
      return;
    }
  
    // Buscar o usuário pelo userName
    this.userService.getUserByUsername(userName).subscribe(
      (user: User) => {
        if (user) {
          // Atualiza a senha do usuário encontrado
          user.password = this.newPassword;
  
          // Chama o método para atualizar o usuário, incluindo a nova senha
          this.updateUser(user);
  
          // Limpa os campos de nova senha e confirmação
          this.newPassword = '';
          this.confirmPassword = '';
  
          // Fecha a popup de alteração de senha
          this.isChangePasswordVisible = false;
  
          alert('Senha alterada com sucesso!');
        } else {
          alert('Usuário não encontrado com o nome de usuário fornecido.');
        }
      },
      (error) => {
        console.error('Erro ao buscar usuário:', error);
        alert('Erro ao buscar usuário. Por favor, tente novamente.');
      }
    );
  }

  isValidPassword(password: string): boolean {
    // Esta regex verifica:
    // ^ - início da entrada
    // (?=.*[a-z]) - pelo menos uma letra minúscula
    // (?=.*[A-Z]) - pelo menos uma letra maiúscula
    // (?=.*\d) - pelo menos um dígito numérico
    // (?=.*[\W_]) - pelo menos um caractere especial
    // .{8,} - pelo menos 8 caracteres no total
    // $ - fim da entrada
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

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

  updateUser(user: User): void {
    user.userChanged = this.cookieService.get('userName');;
    this.userService
      .updateUserByUsername(this.userName, user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  cancelChangePassword(): void {
    this.isChangePasswordVisible = false; // Fecha a popup de alteração de senha
  }
  

  cancelarUserUpdate(): void {
    // Obtém o nome de usuário do cookie ao cancelar a atualização
    this.userName = this.cookieService.get('userName'); // Substitua 'userName' pelo nome do seu cookie
    // Chama o método getUserByUsername para carregar os dados do usuário novamente
    this.userService.getUserByUsername(this.userName).subscribe(
      (user: User) => {
        this.user = user;
        // Limpa os campos e preenche novamente com os dados do usuário
        this.clearAndFillFields(user);
        this.cancelDelete();
      },
      (error) => {
        console.error('Erro ao obter usuário:', error);
      }
    );
  }
  
  clearAndFillFields(user: User): void {
    // Limpa os campos
    this.user = undefined; // Alteração aqui: atribuição de 'undefined' ao invés de 'null'
    // Preenche novamente com os dados do usuário
    setTimeout(() => { // Adiciona um pequeno atraso para garantir que os campos sejam limpos antes de preenchê-los novamente
      this.user = user;
    }, 100); // Ajuste o tempo conforme necessário
  }

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }

  openSuccessPopup(message: string): void {
    console.log('Abrindo popup de sucesso', message);
    this.isSuccessPopupVisible = true;
    console.log('Popup deve estar visível agora', this.isSuccessPopupVisible);
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
  }
  
}
