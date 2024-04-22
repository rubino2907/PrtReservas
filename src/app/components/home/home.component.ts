import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserDto } from '../../models/UserModels/userDto';
import { User } from '../../models/UserModels/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userDto = new UserDto();
  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  isChangePasswordVisible: boolean = false; // Variável para controlar a visibilidade da popup de alteração de senha
  newPassword: string = ''; // Nova senha
  confirmPassword: string = ''; // Confirmação da nova senha
  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService, private userService: UserService ) {}

  login(userDto: UserDto) {
    this.authService.login(userDto).subscribe(
      (response: any) => {
        const { token, isAdmin, userName } = response;
        // Salvar o token, isAdmin e userName nos cookies
        this.cookieService.set('authToken', token);
        this.cookieService.set('isAdmin', isAdmin);
        this.cookieService.set('userName', userName);
        // Redirecionar para a página principal ou outra página após o login bem-sucedido

        if(isAdmin == true){
          this.router.navigate(['/adminDashboard']);
        }else{
          this.router.navigate(['/reservas']);
        }
      },
      (error) => {
        // Manipular erro de login aqui
        console.error('Erro ao fazer login:', error);
        // Exemplo de manipulação de erro: exibir uma mensagem de erro para o usuário
        // this.errorMessage = 'Ocorreu um erro durante o login. Por favor, tente novamente.';
      }
    );
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
  
    const userName = this.userDto.userName; // Obter o userName dos cookies
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

  // showChangePassword(): void {
  //   // Use o serviço UserService para obter a lista de usuários
  //   this.userService.getUsers().subscribe(
  //     (users: User[]) => {
  //       // Verifique se o usuário atual está aprovado ou é um administrador
  //       const currentUser = users.find(user => user.userName === this.userDto.userName);
  //       if (currentUser && (currentUser.canApproveReservations || currentUser.isAdmin)) {
  //         // Se sim, mostra a popup de alteração de senha
  //         this.isChangePasswordVisible = true;
  //       } else {
  //         // Se não, você pode optar por não mostrar a popup ou mostrar uma mensagem de erro
  //         console.log('Usuário não aprovado ou não é um administrador para alterar a senha.');
  //         this.openErrorPopup('Não tens Permissão Para alterar a Password');
  //         // Ou, se preferir, você pode desabilitar o botão para abrir a popup
  //         // Isso requer uma variável adicional para controlar o estado do botão
  //         // Por exemplo:
  //         // this.isChangePasswordButtonDisabled = true;
  //       }
  //     },
  //     (error) => {
  //       console.error('Erro ao obter usuários:', error);
  //       // Manipular erro de obtenção de usuários aqui
  //     }
  //   );
  // }

  showChangePassword(): void {
     // Verifica se o campo de nome de usuário está preenchido
  if (!this.userDto.userName) {
    this.openErrorPopup('Preenche o campo Username');
    return;
  }else{
    this.isChangePasswordVisible = true;
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

  updateUser(user: User): void {
    user.userChanged = this.userDto.userName;
    this.userService
      .updateUsers(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
  }
}
