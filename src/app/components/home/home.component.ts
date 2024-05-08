import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/userServices/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserDto } from '../../models/UserModels/userDto';
import { User } from '../../models/UserModels/user';
import { UserService } from '../../services/userServices/user.service';
import { PendingToPasswordChange } from '../../models/pendingToPasswordChange';
import { PendingToChangePasswordService } from '../../services/pedidosService/pending-to-change-password.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userDto = new UserDto();
  @Input() user?: User;
  pendingToPasswordChange = new PendingToPasswordChange();
  @Output() usersUpdated = new EventEmitter<User[]>();
  @Output() pendingsUpdated = new EventEmitter<PendingToPasswordChange[]>();

  isForgotPasswordPopupVisible: boolean = false;
  isChangePasswordVisible: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  isErrorPopupVisible: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, 
    private router: Router, 
    private cookieService: CookieService, 
    private userService: UserService,
    private pendingToChangePasswordService: PendingToChangePasswordService ) {}

  login(userDto: UserDto) {
    this.authService.login(userDto).subscribe(
      (response: any) => {
        const { token, isAdmin, userName } = response;
        this.cookieService.set('authToken', token);
        this.cookieService.set('isAdmin', isAdmin);
        this.cookieService.set('userName', userName);
        if(isAdmin == true){
          this.router.navigate(['/adminDashboard']);
        }else{
          this.router.navigate(['/reservas']);
        }
      },
      (error) => {
        console.error('Erro ao fazer login:', error);
      }
    );
  }

  showChangePassword(): void {
    if (!this.userDto.userName) {
      this.openErrorPopup('Preenche o campo Username');
      return;
    } else {
      this.isChangePasswordVisible = true;
    }
  }

  // Função para obter a data atual no formato desejado
  getCurrentDate(): string {
    const currentDate = new Date();
    // Formatar a data como "YYYY-MM-DD HH:MM:SS"
    return currentDate.toISOString().slice(0, 19).replace('T', ' ');
  }

  async createPendingToChangePassword(): Promise<void> {
    // Verifica se o createdBy é um nome de usuário existente nos usuários
    const userExists = await this.isUserExists(this.pendingToPasswordChange.createdBy);
    if (!userExists) {
        console.error('Erro ao criar o pedido de alteração de password: O username não existe.');
        this.openErrorPopup('Erro ao criar o pedido de alteração de password: O username não existe.');
        return;
    }

    // Ensuring the object has all necessary data
    this.pendingToPasswordChange.createdBy = this.pendingToPasswordChange.createdBy || 'Ruben'; // Default to 'Ruben' if not set
    this.pendingToPasswordChange.creationDateTime = this.getCurrentDate();
    this.pendingToPasswordChange.changeDateTime = this.getCurrentDate();
    this.pendingToPasswordChange.state = 'EM ESPERA';
    this.pendingToPasswordChange.aprovedBy = 'userName'; // You may want to adjust this based on your app's logic
  
    console.log('Pedido de alteração de senha a ser enviado:', this.pendingToPasswordChange);
  
    this.pendingToChangePasswordService.createPendingToChangePassword(this.pendingToPasswordChange)
        .subscribe(
            response => {
                this.pendingsUpdated.emit([this.pendingToPasswordChange]);
                this.closePopupToCreatePending(); // Assuming you have a method to close the popup
                console.log('Pedido de alteração de senha criado com sucesso:', response);
            },
            error => {
                console.error('Erro ao criar o pedido de alteração de password:', error);
                this.openErrorPopup("Erro ao criar o pedido de alteração de senha. Detalhes: " + (error.error.detail || "Verifique os dados enviados."));
                this.closePopupToCreatePending();
            }
        );
}

// Método para verificar se o usuário existe
async isUserExists(username: string): Promise<boolean> {
  try {
      const users = await this.userService.getUsers().toPromise();
      // Verifica se a resposta contém usuários e, em seguida, verifica se o username existe nos usuários
      const userExists = users && users.some(user => user.userName === username);
      return userExists || false; // Retorna false se users for undefined ou null
  } catch (error) {
      console.error('Erro ao obter usuários:', error);
      throw error;
  }
}



  cancelChangePassword(): void {
    this.isChangePasswordVisible = false;
  }

  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
  }

  openPopupToCreatePending(): void {
    this.isForgotPasswordPopupVisible = true;
  }

  closePopupToCreatePending(): void {
    this.isForgotPasswordPopupVisible = false;
  }
}
