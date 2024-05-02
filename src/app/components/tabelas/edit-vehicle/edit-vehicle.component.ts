import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';
import { IconService } from '../../../services/extraServices/icon.service';

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

  iconList: string[] = []; // Adicione uma variável para armazenar a lista de ícones

  selectedIcon: string = ''; // Adicione a variável selectedIcon e inicialize-a conforme necessário

  isIconListVisible: boolean = false; // Flag para controlar a visibilidade da lista de ícones

  constructor(private vehicleService: VehicleService, private typeVehicleService: TypeVehicleService, private iconService: IconService) {}

  ngOnInit(): void {
    this.loadTypeOfVehicles();
    this.loadIconList();
  }

  loadIconList(): void {
    this.iconService.getIconList().subscribe(
      (icons: string[]) => {
        this.iconList = icons;
        // Defina o ícone selecionado como o primeiro da lista, se houver algum ícone na lista
        if (this.iconList.length > 0) {
          this.selectedIcon = this.iconList[0];
        }
      },
      (error) => {
        console.error("Erro ao carregar lista de ícones:", error);
      }
    );
  }

  toggleIconListVisibility(): void {
    this.isIconListVisible = !this.isIconListVisible;
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.isIconListVisible = false; // Fechar a lista de ícones após selecionar um ícone
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
    console.log("Veiculo icon: ", vehicle.icon)
    console.log("Vehicle antes de ser enviado:", vehicle);
    vehicle.descVehicle = vehicle.matriculation;
    vehicle.defaultLocation = '';
    vehicle.icon = this.selectedIcon;

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
    vehicle.icon = this.selectedIcon;
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
