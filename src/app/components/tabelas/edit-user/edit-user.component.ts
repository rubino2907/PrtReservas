import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/userServices/user.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../../models/UserModels/user';
import { UserGroupService } from '../../../services/userServices/groupUser.service';

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
  @Output()userSucess = new EventEmitter<void>();

  isErrorPopupVisible: boolean = false;
  errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

  groups: string[] = []; // Array para armazenar os tipos

  isFormVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private userService: UserService, 
    private cookieService: CookieService, 
    private userGroups: UserGroupService,
    private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.userGroups.getGroupNames().subscribe(
        (groups: string[]) => {
            // Você pode usar as matriculas diretamente aqui
            this.groups = groups;
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
  }

  showForm(): void {
    this.isFormVisible = true; // Mostra o formulário
  }

  updateUser(user: User): void {
    user.userChanged = this.cookieService.get('userName');
    this.userService
      .updateUsers(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
      this.userSucess.emit();
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
    console.log("Dados do usuário antes de serem enviados:", user);
  
    user.createdBy = this.cookieService.get('userName');
    user.canApproveReservations = false;
    user.changeDateTime = "";
    user.creationDateTime = "";
    user.token = '';
  
    console.log("Usuário criado por:", user.createdBy);
    
  
    this.userService
      .createUsers(user)
      .subscribe(
        (users: User[]) => {
          console.log("Resposta do servidor ao criar usuário:", users);
          this.usersUpdated.emit(users);
          this.user = new User();
          this.userSucess.emit();
          this.isFormVisible = false;
        },
        (error) => {
          const errorMessage = error.error;
          console.error("Mensagem de erro:", errorMessage);
          this.errorMessage = errorMessage;
          this.openErrorPopup(errorMessage);
          console.error("Erro ao criar usuário:", error);
        }
      );
  }
  

  openErrorPopup(message: string): void {
    this.isErrorPopupVisible = true;
    this.errorMessage = message;
    this.cdr.detectChanges(); // Solicita ao Angular para detectar mudanças
  }

  closeErrorPopup(): void {
    this.isErrorPopupVisible = false;
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
    if (!this.isValidPassword(this.newPassword)) {
      alert('A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e um caractere especial.');
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
  
    if (this.user) { // Verifica se user não é undefined
      // Atualiza a senha no objeto do usuário
      this.user.password = this.newPassword;
  
      // Chama o método para atualizar o usuário, incluindo a nova senha
      this.updateUser(this.user);
  
      // Limpa os campos de nova senha e confirmação
      this.newPassword = '';
      this.confirmPassword = '';
  
      alert('Password alterada com sucesso!');
    } else {
      alert('Usuário não está definido. Por favor, tente novamente.');
    }
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
