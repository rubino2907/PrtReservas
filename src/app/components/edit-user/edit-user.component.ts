import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
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
    console.log("User antes de ser enviado:", user);

    user.createdBy = this.cookieService.get('userName');
    user.canApproveReservations = true;
    user.changeDateTime = "";
    user.creationDateTime = "";
    user.token = '';

    console.log(user.createdBy)

    this.userService
      .createUsers(user)
      .subscribe(
        (users: User[]) => {
          console.log("Resposta do servidor ao criar usuário:", users);
          this.usersUpdated.emit(users);
          console.log("Usuário criado com sucesso!", users);
          this.isFormVisible = false; // Esconde o formulário após criar o usuário com sucesso
        },
        (error) => {
          console.error("Erro ao criar usuário:", error);
        }
      );
  }
}
