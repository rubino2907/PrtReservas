import { Component, Input } from '@angular/core';
import { TypeVehicle } from '../../../models/VehicleModels/typeVehicle';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';

@Component({
  selector: 'app-list-type-vehicles',
  templateUrl: './list-type-vehicles.component.html',
  styleUrl: './list-type-vehicles.component.css'
})
export class ListTypeVehiclesComponent {
  @Input() typeVehicles: TypeVehicle[] = [];
  @Input() typeVehicleToEdit?: TypeVehicle;
  @Input() isFormEdittypeVehicleVisible: boolean = false;

  constructor(private typeVehiclesService: TypeVehicleService) {}

  ngOnInit(): void {
    this.typeVehiclesService.getTypeVehicles()
      .subscribe((result: TypeVehicle[]) => {
        this.typeVehicles = result;
      });

    this.isFormEdittypeVehicleVisible = false;
  }

  editTypeVehicle(typeVehicles: TypeVehicle): void {
    this.typeVehicleToEdit = typeVehicles;
    this.isFormEdittypeVehicleVisible = !this.isFormEdittypeVehicleVisible;
  }
  
  updateTypeVehicle(typeVehicles: TypeVehicle[]): void {
    this.typeVehicles = typeVehicles;
    this.isFormEdittypeVehicleVisible = !this.isFormEdittypeVehicleVisible;
  }

  initNewTypeVehicle(): void {
    this.typeVehicleToEdit = this.isFormEdittypeVehicleVisible ? undefined : new TypeVehicle();
    this.isFormEdittypeVehicleVisible = !this.isFormEdittypeVehicleVisible;
  }

  fecharForm(): void {
    // Limpar o pendingsToEdit
    this.typeVehicleToEdit = undefined;

    // Ocultar o formulário de edição
    this.isFormEdittypeVehicleVisible = false;
  }
}
