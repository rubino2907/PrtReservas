import { Component, Input } from '@angular/core';
import { UserService } from '../../../services/userServices/user.service';
import { User } from '../../../models/UserModels/user';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'] 
})
export class ListUsersComponent {
  @Input() users: User[] = [];
  @Input() userToEdit?: User;
  @Input() isFormVisible: boolean = false;
  
  isSearchingByUser: boolean = true;
  searchInput: string = '';
  filteredUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe((result: User[]) => {
        this.users = result;
        this.filteredUsers = result; // Inicializa a lista filtrada com todos os usuários
      });

    this.isFormVisible = false;
  }

  editUser(user: User): void {
    this.userToEdit = user;
    this.isFormVisible = !this.isFormVisible;
  }
  
  updateUserList(users: User[]): void {
    this.users = users;
    this.filteredUsers = users; // Atualiza a lista filtrada ao receber novos usuários
    this.isFormVisible = !this.isFormVisible;
  }

  initNewUser(): void {
    this.userToEdit = this.isFormVisible ? undefined : new User();
    this.isFormVisible = !this.isFormVisible;
  }

  fecharForm(): void {
    this.isFormVisible = false;
  }

  toggleSearch(): void {
    this.isSearchingByUser = !this.isSearchingByUser;
    this.searchInput = ''; // Limpa o input ao alternar
    this.filterUsers(); // Chama a função de filtro ao alternar
  }

  filterUsers(): void {
    if (this.isSearchingByUser) {
      this.filteredUsers = this.users.filter(user => user.userName.toLowerCase().includes(this.searchInput.toLowerCase()));
    } else {
      this.filteredUsers = this.users.filter(user => user.group.toLowerCase().includes(this.searchInput.toLowerCase()));
    }
  }
}
