import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.css'
})
export class EditVehicleComponent implements OnInit  {
  @Input() vehicle?: Vehicle;
  @Output() vehiclesUpdated = new EventEmitter<Vehicle[]>();

  isFormEditVehicleVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {}

  showForm(): void {
    this.isFormEditVehicleVisible = true; // Mostra o formulário
  }

  createVehicle(vehicle: Vehicle): void {
    console.log("Vehicle antes de ser enviado:", vehicle);
    vehicle.descVehicle = vehicle.matriculation;

    this.vehicleService
      .createVehicles(vehicle)
      .subscribe(
        (vehicles: Vehicle[]) => {
          console.log("Resposta do servidor ao criar Vehicle:", vehicles);
          this.vehiclesUpdated.emit(vehicles);
          console.log("Vehicle criado com sucesso!", vehicles);
          this.isFormEditVehicleVisible = false; // Esconde o formulário após criar o usuário com sucesso
        },
        (error) => {
          console.error("Erro ao criar Vehicle:", error);
        }
      );
  }

  updateVehicle(vehicle: Vehicle): void {
    this.vehicleService
      .updateVehicles(vehicle)
      .subscribe((vehicles: Vehicle[]) => {
        this.vehiclesUpdated.emit(vehicles);
        this.isFormEditVehicleVisible = false; // Esconde o formulário após a atualização bem-sucedida
      });
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.vehicleService
      .deleteVehicles(vehicle)
      .subscribe((vehicles: Vehicle[]) => {
        this.vehiclesUpdated.emit(vehicles);
        this.isFormEditVehicleVisible = false; // Esconde o formulário após excluir o usuário
      });
  }
}
