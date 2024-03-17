import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-reserva',
  templateUrl: './create-reserva.component.html',
  styleUrls: ['./create-reserva.component.css']
})
export class CreateReservaComponent  implements OnInit{

  matriculas: string[] = [];
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();

  constructor(private vehicleService: VehicleService, private reserveService: ReserveService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.carregarMatriculas();
  }

  carregarMatriculas(): void {
    this.vehicleService.getMatriculations().subscribe(
      matriculas => {
        this.matriculas = matriculas;
      },
      error => {
        console.log('Erro ao carregar as matrículas:', error);
      }
    );
  }

  createReserva(): void {
    const reserve = new Reserve(); // Criando uma nova instância de Reserve
    console.log("Reserva antes de ser enviada:", reserve);

    const userAdmin: boolean = this.cookieService.get('isAdmin') === 'true'; // Converte para booleano

    if (userAdmin) { // Verifica se o usuário é admin
        console.log('Usuário é admin.');
        reserve.state = 'Ativa';
    } else {
        console.log('Usuário não é admin.');
        reserve.state = 'Em espera';
    }

    // Chamar o método createReserve do service e passar a nova reserva
    this.reserveService.createReserve(reserve).subscribe(
        (reserves: Reserve[]) => {
          console.log("Resposta do servidor ao criar reserva:", reserves);
          this.reservesUpdated.emit(reserves);
          console.log("Reserva criada com sucesso!", reserves);
        },
        (error) => {
          console.error("Erro ao criar reserva:", error);
        }
    );
  }
}
