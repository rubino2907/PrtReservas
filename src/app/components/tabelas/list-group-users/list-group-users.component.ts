import { Component, Input } from '@angular/core';
import { UserGroup } from '../../../models/UserModels/groupUsers';
import { UserGroupService } from '../../../services/userServices/groupUser.service';

@Component({
  selector: 'app-list-group-users',
  templateUrl: './list-group-users.component.html',
  styleUrl: './list-group-users.component.css'
})
export class ListGroupUsersComponent {
  @Input() userGroups: UserGroup[] = [];
  @Input() userGroupToEdit?: UserGroup;
  @Input() isFormEditUserGroupVisible: boolean = false;

  constructor(private userGroupService: UserGroupService) {}

  ngOnInit(): void {
    this.userGroupService.getUserGroups()
      .subscribe((result: UserGroup[]) => {
        this.userGroups = result;
      });

    this.isFormEditUserGroupVisible = false;
  }

  editUserGroup(userGroups: UserGroup): void {
    this.userGroupToEdit = userGroups;
    this.isFormEditUserGroupVisible = !this.isFormEditUserGroupVisible;
  }
  
  updateUserGroup(userGroups: UserGroup[]): void {
    this.userGroups = userGroups;
    this.isFormEditUserGroupVisible = !this.isFormEditUserGroupVisible;
  }

  initNewUserGroup(): void {
    this.userGroupToEdit = this.isFormEditUserGroupVisible ? undefined : new UserGroup();
    this.isFormEditUserGroupVisible = !this.isFormEditUserGroupVisible;
  }

  fecharForm(): void {
    // Limpar o pendingsToEdit
    this.userGroupToEdit = undefined;

    // Ocultar o formulário de edição
    this.isFormEditUserGroupVisible = false;
  }
}
