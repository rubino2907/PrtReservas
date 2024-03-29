import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';

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

  constructor(private reserveService: ReserveService ,private userService: UserService, private vehicleService: VehicleService) { }

  ngOnInit(): void {
    // Chama o método para obter a contagem de usuários ao inicializar o componente
    this.getUsers();
    this.getVehicles();
    this.getReserves();
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
}
