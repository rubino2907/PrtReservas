import { Component, Input } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'] 
})
export class ListUsersComponent {
  @Input() users: User[] = [];
  @Input() userToEdit?: User;
  @Input() isFormVisible: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe((result: User[]) => {
        this.users = result;
      });

      this.isFormVisible = false;
  }

  editUser(user: User): void {
    this.userToEdit = user;
    this.isFormVisible = !this.isFormVisible;
  }
  
  updateUserList(users: User[]): void {
    this.users = users;
    this.isFormVisible = !this.isFormVisible;
  }

  initNewUser(): void {
    this.userToEdit = this.isFormVisible ? undefined : new User();
    this.isFormVisible = !this.isFormVisible;
  }

  fecharForm(){
    this.isFormVisible = false;
  }
}
