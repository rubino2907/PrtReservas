import { Component, EventEmitter, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { CookieService } from 'ngx-cookie-service';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { PendantService } from '../../../services/pedidosService/pending.service';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';

@Component({
  selector: 'app-reports-pendings',
  templateUrl: './reports-pendings.component.html',
  styleUrl: './reports-pendings.component.css'
})
export class ReportsPendingsComponent {
    pendings: Pending[] = [];
    sortColumn: string = 'aproved';
    sortDirection: string = 'desc'; // 'asc' para ascendente, 'desc' para descendente
    @Output() pendingsUpdated: EventEmitter<any> = new EventEmitter();
    
    isDeleteConfirmationVisible: boolean = false;

    matriculations: string[] = []; // Array para armazenar as matrículas

    filteredPendings: any[] = []; // Lista filtrada para exibição
    selectedMatricula: string = '';
    startDate: string = '';
    endDate: string = '';

    isSuccessPopupVisible: boolean = false;
    isErrorPopupVisible: boolean = false;
    errorMessage: string = ''; // Propriedade para armazenar a mensagem de erro específica

    selectedVehicleType: string = ''; // Armazena o tipo de viatura selecionado

    vehicleType: string[] = []; // Array para armazenar os tipos

    constructor(private cookieService: CookieService, 
      private typeVehicleService: TypeVehicleService, 
      private vehicleService: VehicleService, 
      private pendantService: PendantService) { }

    ngOnInit(): void {
      this.loadTypeOfVehicles();
    }

    clearDate(field: string) {
      if (field === 'startDate') {
          this.startDate = ''; // Alteração aqui
      } else if (field === 'endDate') {
          this.endDate = ''; // Alteração aqui
      }
      this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
    }

    loadTypeOfVehicles(): void {
      this.typeVehicleService.getTypeOfVehicle().subscribe(
          (vehicleType: string[]) => {
              // Você pode usar as matriculas diretamente aqui
              this.vehicleType = vehicleType;
          },
          (error) => {
              console.error("Erro ao carregar matrículas por tipo:", error);
              // Lide com os erros adequadamente
          }
      );
    }

    
    loadMatriculations(vehicleType: string): void {
      if (!vehicleType) {
          this.matriculations = [];
          return;
      }

      this.vehicleService.getVehiclesByType(vehicleType).subscribe(
          (vehicles: Vehicle[]) => {
              // Ensure only non-undefined matriculations are included
              this.matriculations = vehicles.map(vehicle => vehicle.matriculation).filter((matriculation): matriculation is string => matriculation !== null && matriculation !== undefined);
          },
          (error) => {
              console.error("Erro ao carregar matrículas por tipo:", error);
          }
      );
    }

    applyFilters(): void {
      // Converta as strings de data para objetos Date para comparação
      let startDate = this.startDate ? new Date(this.startDate) : null;
      let endDate = this.endDate ? new Date(this.endDate) : null;
    
      // Chame o serviço para obter os pendentes com os filtros aplicados
      this.pendantService.getPendings().subscribe(
        (pendings: Pending[]) => {
          this.filteredPendings = pendings.filter(pending => {
            const matchMatricula = this.selectedMatricula ? pending.matriculation === this.selectedMatricula : true;
            const pendingStartDate = pending.dateStart ? new Date(pending.dateStart) : new Date();
            const pendingEndDate = pending.dateEnd ? new Date(pending.dateEnd) : new Date();
            const matchStartDate = startDate ? pendingStartDate >= startDate : true;
            const matchEndDate = endDate ? pendingEndDate <= endDate : true;
            return matchMatricula && matchStartDate && matchEndDate;
          });
        },
        error => {
          console.error('Erro ao carregar pendentes:', error);
        }
      );
    }

    cleanTable() {
      this.filteredPendings = [];
      this.selectedMatricula = '';
      this.selectedVehicleType = '';
      this.startDate = '';
      this.endDate = '';
    }
    
    // Método para ordenar a tabela com base no estado de aprovação
    sortTableByApproval(): void {
      // Alterne a direção da ordenação
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

      // Atualize a coluna de ordenação para 'aproved'
      this.sortColumn = 'aproved';

      // Defina a ordem desejada dos estados
      const order = ['EM ESPERA', 'APROVADO', 'RECUSADO'];

      // Classifique os pendentes com base no estado de aprovação e na direção da ordenação
      this.filteredPendings.sort((a, b) => {
          // Verifique se 'a.aproved' e 'b.aproved' estão definidos
          if (a.aproved !== undefined && b.aproved !== undefined) {
              const indexA = order.indexOf(a.aproved);
              const indexB = order.indexOf(b.aproved);
              
              // Se ambos os estados estiverem na ordem, classifique com base nessa ordem
              if (indexA !== -1 && indexB !== -1) {
                  if (this.sortDirection === 'asc') {
                      return indexA - indexB;
                  } else {
                      return indexB - indexA;
                  }
              }
              // Se apenas um estado estiver na ordem, coloque-o antes
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
          }
          // Se 'a.aproved' ou 'b.aproved' não forem definidos ou não estiverem na ordem, mantenha a ordem atual
          return 0;
      });
    }

    // Função para retornar a classe com base no estado do pedido
    getPendingStatusClass(status: string | undefined): string {
      if (status === 'APROVADO') {
        return 'approved';
      } else if (status === 'EM ESPERA') {
        return 'pending';
      } else if (status === 'RECUSADO') {
        return 'not-approved';
      } else {
        return ''; // Retorna uma string vazia se o status for undefined
      }
    }

    // No seu componente TypeScript
    sortTableByStartDateIcon() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

      // Aqui você deve implementar a lógica para ordenar o array 'filteredPendings' com base na data de início
      // Você pode usar a função de ordenação do JavaScript, por exemplo:
      this.filteredPendings.sort((a, b) => {
          const dateA = new Date(a.dateStart).getTime();
          const dateB = new Date(b.dateStart).getTime();
          
          if (this.sortDirection === 'asc') {
              return dateA - dateB;
          } else {
              return dateA - dateB;
          }
      });
    }
}
