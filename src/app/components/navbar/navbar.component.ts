import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string = '';
  isAdmin: boolean = false; // Adicionamos essa variável para armazenar o valor de isAdmin

  constructor(private router: Router, private cookieService: CookieService, private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.cookieService.get('userName');
    const isAdminCookie = this.cookieService.get('isAdmin');
    this.isAdmin = isAdminCookie === 'true'; // Interpretamos o valor do cookie como booleano
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
}
