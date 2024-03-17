import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-list-vehicles',
  templateUrl: './list-vehicles.component.html',
  styleUrls: ['./list-vehicles.component.css'] // Aqui está a correção
})

export class ListVehiclesComponent {
  
  @Input() vehicles: Vehicle[] = [];
  @Input() vehiclesToEdit?: Vehicle;
  @Input() isFormEditVehicleVisible: boolean = false;

  constructor( private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicleService.getVehicles()
      .subscribe((result: Vehicle[]) => {
        this.vehicles = result;
        console.log(this.vehicles)
      })

      this.isFormEditVehicleVisible = false;
  }
  
  editVehicle(vehicle: Vehicle): void {
    this.vehiclesToEdit = vehicle;
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }

  updateVehicleList(vehicles: Vehicle[]): void {
    this.vehicles = vehicles;
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }

  initNewVehicle(): void {
    this.vehiclesToEdit = this.isFormEditVehicleVisible ? undefined : new Vehicle();
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }
  
}
