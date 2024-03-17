import { Component } from '@angular/core';
import { UserDto } from '../../models/userDto';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userDto = new UserDto();

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {}

  login(userDto: UserDto) {
    this.authService.login(userDto).subscribe(
      (response: any) => {
        const { token, isAdmin, userName } = response;
        // Salvar o token, isAdmin e userName nos cookies
        this.cookieService.set('authToken', token);
        this.cookieService.set('isAdmin', isAdmin);
        this.cookieService.set('userName', userName);
        // Redirecionar para a página principal ou outra página após o login bem-sucedido

        if(isAdmin == true){
          this.router.navigate(['/adminDashboard']);
        }else{
          this.router.navigate(['/reservas']);
        }
      },
      (error) => {
        // Manipular erro de login aqui
        console.error('Erro ao fazer login:', error);
        // Exemplo de manipulação de erro: exibir uma mensagem de erro para o usuário
        // this.errorMessage = 'Ocorreu um erro durante o login. Por favor, tente novamente.';
      }
    );
  }
}
