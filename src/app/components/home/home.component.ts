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

  showChangePassword(): void {
     // Verifica se o campo de nome de usuário está preenchido
  if (!this.userDto.userName) {
    this.openErrorPopup('Preenche o campo Username');
    return;
  }else{
    this.isChangePasswordVisible = true;
  }

  }

  cancelChangePassword(): void {
    this.isChangePasswordVisible = false; // Fecha a popup de alteração de senha
  }
  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
  }
}
