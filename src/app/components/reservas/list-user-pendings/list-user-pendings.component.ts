import { Component, OnInit } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-list-user-pendings',
  templateUrl: './list-user-pendings.component.html',
  styleUrls: ['./list-user-pendings.component.css']
})
export class ListUserPendingsComponent implements OnInit {
  pendings: Pending[] = [];

  constructor(private cookieService: CookieService, private pendantService: PendantService) { }

  ngOnInit(): void {
    // Chame o método do serviço para obter os pendentes do usuário
    this.getPendingsByCurrentUser();
  }

  // Método para obter os pendentes do usuário atual
  getPendingsByCurrentUser(): void {
    // Substitua 'currentUser' pelo identificador do usuário atual
    const currentUser = this.cookieService.get('userName'); // Exemplo: 'username'
    
    this.pendantService.getPendingsByCreatedBy(currentUser).subscribe(
      (pendings: Pending[]) => {
        this.pendings = pendings;
      },
      error => {
        console.error('Erro ao carregar pendentes:', error);
      }
    );
  }
}
