import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeVehicle } from '../../../models/VehicleModels/typeVehicle';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';

@Component({
  selector: 'app-edit-type-vehicles',
  templateUrl: './edit-type-vehicles.component.html',
  styleUrl: './edit-type-vehicles.component.css'
})
export class EditTypeVehiclesComponent {

  @Input() typeVehicle?: TypeVehicle;
  @Output() typeVehicleUpdated = new EventEmitter<TypeVehicle[]>();

  typeVehicles: string[] = []; // Array para armazenar os tipos

  isFormEdittypeVehicleVisible: boolean = false; // Variável para controlar a visibilidade do formulário

  constructor(private typeVehicleService: TypeVehicleService) {}
  
  showForm(): void {
    this.isFormEdittypeVehicleVisible = true; // Mostra o formulário
  }

  createTypeVehicle(typeVehicle: TypeVehicle): void {
    console.log("typeVehicle antes de ser enviado:", typeVehicle);

    this.typeVehicleService
      .createTypeVehicle(typeVehicle)
      .subscribe(
        (typeVehicle: TypeVehicle[]) => {
          console.log("Resposta do servidor ao criar typeVehicle:", typeVehicle);
          this.typeVehicleUpdated.emit(typeVehicle);
          console.log("Vehicle criado com sucesso!", typeVehicle);
          this.isFormEdittypeVehicleVisible = false; // Esconde o formulário após criar o usuário com sucesso
        },
        (error) => {
          console.error("Erro ao criar typeVehicle:", error);
        }
      );
  }

  updateTypeVehicle(typeVehicle: TypeVehicle): void {
    this.typeVehicleService
      .updateTypeVehicle(typeVehicle)
      .subscribe((typeVehicle: TypeVehicle[]) => {
        this.typeVehicleUpdated.emit(typeVehicle);
        this.isFormEdittypeVehicleVisible = false; // Esconde o formulário após a atualização bem-sucedida
      });
  }

  deleteTypeVehicle(typeVehicle: TypeVehicle): void {
    this.typeVehicleService
      .deleteTypeVehicle(typeVehicle)
      .subscribe((typeVehicle: TypeVehicle[]) => {
        this.typeVehicleUpdated.emit(typeVehicle);
        this.isFormEdittypeVehicleVisible = false; // Esconde o formulário após excluir o usuário
      });
  }

}
