import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject, interval, takeUntil  } from 'rxjs';
import { PendantService } from '../../services/pending.service';
import { Pending } from '../../models/pending';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string = '';
  isAdmin: boolean = false; // Adicionamos essa variável para armazenar o valor de isAdmin
  pendingCount: number = 0; // Adicione a variável para armazenar o número de pendentes
  showNotification: boolean = false;


  constructor(private router: Router, private cookieService: CookieService, private authService: AuthService, private pendingService: PendantService) {}

  ngOnInit(): void {
    this.username = this.cookieService.get('userName');
    const isAdminCookie = this.cookieService.get('isAdmin');
    this.isAdmin = isAdminCookie === 'true'; // Interpretamos o valor do cookie como booleano

    this.pendingService.getPendingsByAproved()
      .subscribe((pendants: Pending[]) => {
        this.pendingCount = pendants.length;
      });
  }

  GoToReservas(){
    this.router.navigate(['/reservas']);
  }

  GoToDashboard(){
    if(this.isAdmin == true){
      this.router.navigate(['/adminDashboard']);
    }else{
      this.router.navigate(['/reservas']);
    }
  }
  

  logout() {
    console.log('Realizando logout');
    localStorage.clear();
    this.cookieService.deleteAll();
    this.router.navigate(['']);
  }

  toggleNotification() {
    this.showNotification = !this.showNotification;
  }

  hideNotification() {
    this.showNotification = false;
  }
}
