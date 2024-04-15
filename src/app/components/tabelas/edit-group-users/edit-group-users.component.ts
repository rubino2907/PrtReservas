import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserGroup } from '../../../models/UserModels/groupUsers';
import { UserGroupService } from '../../../services/groupUser.service';

@Component({
  selector: 'app-edit-group-users',
  templateUrl: './edit-group-users.component.html',
  styleUrl: './edit-group-users.component.css'
})
export class EditGroupUsersComponent {

  @Input() userGroup?: UserGroup;
  @Output() UserGroupUpdated = new EventEmitter<UserGroup[]>();

  userGroups: string[] = []; // Array para armazenar os tipos

  isFormEditUserGroupVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private userGroupService: UserGroupService) {}
  
  showForm(): void {
    this.isFormEditUserGroupVisible = true; // Mostra o formulário
  }

  createUserGroup(userGroup: UserGroup): void {
    console.log("typeVehicle antes de ser enviado:", userGroup);

    this.userGroupService
      .createUserGroup(userGroup)
      .subscribe(
        (userGroup: UserGroup[]) => {
          console.log("Resposta do servidor ao criar typeVehicle:", userGroup);
          this.UserGroupUpdated.emit(userGroup);
          console.log("Vehicle criado com sucesso!", userGroup);
          this.isFormEditUserGroupVisible = false; // Esconde o formulário após criar o usuário com sucesso
        },
        (error) => {
          console.error("Erro ao criar typeVehicle:", error);
        }
      );
  }

  updateUserGroup(userGroup: UserGroup): void {
    this.userGroupService
      .updateUserGroup(userGroup)
      .subscribe((userGroup: UserGroup[]) => {
        this.UserGroupUpdated.emit(userGroup);
        this.isFormEditUserGroupVisible = false; // Esconde o formulário após a atualização bem-sucedida
      });
  }

  deleteUserGroup(userGroup: UserGroup): void {
    this.userGroupService
      .deleteUserGroup(userGroup)
      .subscribe((userGroup: UserGroup[]) => {
        this.UserGroupUpdated.emit(userGroup);
        this.isFormEditUserGroupVisible = false; // Esconde o formulário após excluir o usuário
      });
  }

}
