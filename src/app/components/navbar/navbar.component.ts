import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/userServices/auth.service';
import { Pending } from '../../models/pending';
import { PendantService } from '../../services/pedidosService/pending.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string = '';
  isAdmin: boolean = false;
  pendingCount: number = 0;
  showNotification: boolean = false;
  isReservasActive: boolean = false; // Variável para indicar se a página de reservas está ativa
  isDashboardActive: boolean = false; // Variável para indicar se a página do dashboard está ativa
  isTabelasActive: boolean = false;
  isGestaoActive: boolean = false;
  isUserProfileActive: boolean = false;

  constructor(private router: Router, private cookieService: CookieService, private authService: AuthService, private pendingService: PendantService) {}

  ngOnInit(): void {
    this.username = this.cookieService.get('userName');
    const isAdminCookie = this.cookieService.get('isAdmin');
    this.isAdmin = isAdminCookie === 'true';

    this.pendingService.getPendingsByAproved()
      .subscribe((pendants: Pending[]) => {
        this.pendingCount = pendants.length;
      });

    // Verifica a rota atual e define as variáveis isReservasActive e isDashboardActive
    this.router.events.subscribe((val) => {
      if (this.router.url.includes('reservas')) {
        this.isReservasActive = true;
        this.isDashboardActive = false;
        this.isTabelasActive = false;
        this.isGestaoActive = false;
        this.isUserProfileActive = false;
      } else if (this.router.url.includes('adminDashboard')) {
        this.isReservasActive = false;
        this.isDashboardActive = true;
        this.isTabelasActive = false;
        this.isGestaoActive = false;
        this.isUserProfileActive = false;
      } else if (this.router.url.includes('tabelas')) {
        this.isReservasActive = false;
        this.isDashboardActive = false;
        this.isTabelasActive = true;
        this.isGestaoActive = false;
        this.isUserProfileActive = false;
      } else if (this.router.url.includes('gestao')) {
        this.isReservasActive = false;
        this.isDashboardActive = false;
        this.isTabelasActive = false;
        this.isGestaoActive = true;
        this.isUserProfileActive = false;
      }  else if (this.router.url.includes('userProfile')){
        this.isReservasActive = false;
        this.isDashboardActive = false;
        this.isTabelasActive = false;
        this.isGestaoActive = false;
        this.isUserProfileActive = true;
      }else{
        this.isReservasActive = false;
        this.isDashboardActive = false;
        this.isTabelasActive = false;
        this.isGestaoActive = false;
      }
    });
  }

  showDropdownMessage: boolean = false;


  GoToReservas(){
    this.router.navigate(['/reservas']);
  }

  GoToGestao(){
    this.router.navigate(['/gestao']);
  }

  GoToUserProfile(){
    this.router.navigate(['/userProfile']);
  }

  GoToTabelas(){
    this.router.navigate(['/tabelas']);
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

  toggleNotification(isHovering: boolean) {
    this.showDropdownMessage = isHovering;
  }


  hideNotification() {
    this.showNotification = false;
  }
}
