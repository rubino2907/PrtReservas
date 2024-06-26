import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/userServices/user.service';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../../models/UserModels/user';

@Component({
  selector: 'app-base-admin-dashboard',
  templateUrl: './base-admin-dashboard.component.html',
  styleUrls: ['./base-admin-dashboard.component.css']
})
export class BaseAdminDashboardComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() vehicles: Vehicle[] = [];
  userCount: number = 0; // Inicializa a variável userCount
  vehicleCount: number = 0;
  reserveCount: number = 0;
  userName: string = ''; // Variável para armazenar o nome de usuário

  averageReservationTime: number = 0; // Inicializa a variável averageReservationTime
  @Input() mostUsedVehicles: string[] = [];
  @Input() leastUsedVehicles: string[] = [];
  userWithMostOrders: string = ''; // Variável para armazenar o usuário com mais pedidos

  constructor(private reserveService: ReserveService ,private userService: UserService, private vehicleService: VehicleService, private cookieService: CookieService) { }

  ngOnInit(): void {
    // Obtém o nome de usuário do cookie ao inicializar o componente
    this.userName = this.cookieService.get('userName'); // Substitua 'userName' pelo nome do seu cookie
    // Chama o método para obter a contagem de usuários ao inicializar o componente
    this.getUsers();
    this.getVehicles();
    this.getReserves();
    this.getAverageReservationTime(); // Chama o método para obter o tempo médio de reserva
    this.getMostAndLeastUsedVehicles();
    this.getUserWithMostOrders(); // Chama o método para obter o usuário com mais pedidos
    console.log(this.userWithMostOrders);
  }

  getUsers(): void {
    // Chama o serviço para obter a contagem de usuários
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        // Atribui o resultado da contagem à variável userCount
        this.userCount = users.length;
      },
      error => {
        console.error('Erro ao obter a contagem de usuários:', error);
        // Em caso de erro, você pode definir um valor padrão ou lidar com o erro de outra forma
      }
    );
  }

  getVehicles(): void {
    // Chama o serviço para obter a contagem de usuários
    this.vehicleService.getVehicles().subscribe(
      (vehicles: Vehicle[]) => {
        // Atribui o resultado da contagem à variável userCount
        this.vehicleCount = vehicles.length;
      },
      error => {
        console.error('Erro ao obter a contagem de veiculos:', error);
        // Em caso de erro, você pode definir um valor padrão ou lidar com o erro de outra forma
      }
    );
  }

  getReserves():void{
    this.reserveService.getReserves().subscribe(
      (reserves: Reserve[]) => {
        this.reserveCount = reserves.length;
      },
      error => {
        console.error('Erro ao obter a contagem de veiculos:', error);
        // Em caso de erro, você pode definir um valor padrão ou lidar com o erro de outra forma
      }

    )
  }

  getAverageReservationTime(): void {
    // Chama o serviço para obter o tempo médio de reserva
    this.reserveService.getAverageReservationTime().subscribe(
      (averageTime: number) => {
        // Atribui o resultado ao averageReservationTime
        this.averageReservationTime = averageTime;
      },
      error => {
        console.error('Erro ao obter o tempo médio de reserva:', error);
        // Em caso de erro, você pode definir um valor padrão ou lidar com o erro de outra forma
      }
    );
  }

  getMostAndLeastUsedVehicles(): void {
    this.reserveService.getMostAndLeastUsedVehicles().subscribe(
      (data: any) => {
        this.mostUsedVehicles = data.mostUsed;
        this.leastUsedVehicles = data.leastUsed;
      },
      error => {
        console.error('Error getting most and least used vehicles:', error);
      }
    );
  }

  getUserWithMostOrders(): void {
    this.reserveService.getUserWithMostOrders().subscribe(
        (user: string) => {
            if (user) {
                this.userWithMostOrders = user;
            } else {
                console.error('User with most orders not found.');
            }
        },
        error => {
            console.error('Error getting user with most orders:', error);
        }
    );
}
}
