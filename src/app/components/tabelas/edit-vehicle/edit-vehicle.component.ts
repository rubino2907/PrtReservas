import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { TypeVehicleService } from '../../../services/typeVehicle.service';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.css'
})
export class EditVehicleComponent implements OnInit  {
  @Input() vehicle?: Vehicle;
  @Output() vehiclesUpdated = new EventEmitter<Vehicle[]>();
  isDeleteConfirmationVisible: boolean = false;

  typeOfVehicles: string[] = []; // Array para armazenar os tipos

  isFormEditVehicleVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private vehicleService: VehicleService, private typeVehicleService: TypeVehicleService) {}

  ngOnInit(): void {
    this.loadTypeOfVehicles();
  }

  loadTypeOfVehicles(): void {
    this.typeVehicleService.getTypeOfVehicle().subscribe(
        (typeOfVehicles: string[]) => {
            // Você pode usar as matriculas diretamente aqui
            this.typeOfVehicles = typeOfVehicles;
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
  }

  showForm(): void {
    this.isFormEditVehicleVisible = true; // Mostra o formulário
  }

  showDeleteConfirmation(): void {
    this.isDeleteConfirmationVisible = true; // Mostra o popup de confirmação
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false; // Fecha o popup de confirmação
  }

  createVehicle(vehicle: Vehicle): void {
    console.log("Vehicle antes de ser enviado:", vehicle);
    vehicle.descVehicle = vehicle.matriculation;
    vehicle.defaultLocation = '';

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
