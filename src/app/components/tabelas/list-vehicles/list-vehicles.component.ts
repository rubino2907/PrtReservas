import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-list-vehicles',
  templateUrl: './list-vehicles.component.html',
  styleUrls: ['./list-vehicles.component.css']
})
export class ListVehiclesComponent {
  
  @Input() vehicles: Vehicle[] = [];
  @Input() vehiclesToEdit?: Vehicle;
  @Input() isFormEditVehicleVisible: boolean = false;
  isSearchingByMatriculation: boolean = true;
  searchInput: string = '';
  selectedVehicleType: string = '';
  filteredVehicles: Vehicle[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.getVehicles();
  }

  getVehicles(): void {
    this.vehicleService.getVehicles()
      .subscribe((result: Vehicle[]) => {
        this.vehicles = result;
        this.filteredVehicles = result;
      });
  }

  toggleSearch(): void {
    this.isSearchingByMatriculation = !this.isSearchingByMatriculation;
    this.searchInput = '';
    this.filterVehicles();
  }

  filterVehicles(): void {
    if (this.isSearchingByMatriculation) {
      this.filteredVehicles = this.vehicles.filter(vehicle =>
        vehicle.matriculation && vehicle.matriculation.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      if (this.selectedVehicleType === '') {
        this.filteredVehicles = this.vehicles; // Exibir a lista completa se nenhum tipo for selecionado
      } else {
        this.filteredVehicles = this.vehicles.filter(vehicle =>
          vehicle.typeVehicle && vehicle.typeVehicle.toLowerCase() === this.selectedVehicleType.toLowerCase()
        );
      }
    }
  }
  
  editVehicle(vehicle: Vehicle): void {
    this.vehiclesToEdit = vehicle;
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }

  updateVehicleList(vehicles: Vehicle[]): void {
    this.vehicles = vehicles;
    this.filteredVehicles = vehicles;
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }

  initNewVehicle(): void {
    this.vehiclesToEdit = this.isFormEditVehicleVisible ? undefined : new Vehicle();
    this.isFormEditVehicleVisible = !this.isFormEditVehicleVisible;
  }
  
  fecharForm(): void {
    this.isFormEditVehicleVisible = false;
  }
}
