import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Reserve } from '../../../models/reserve';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { VehicleService } from '../../../services/vehicles/vehicle.service';

@Component({
  selector: 'app-list-reserves',
  templateUrl: './list-reserves.component.html',
  styleUrl: './list-reserves.component.css'
})
export class ListReservesComponent implements OnInit {

  @Input() reserves: Reserve[] = [];
  @Input() reservesToEdit?: Reserve;
  @Input() isFormEditReserveVisible: boolean = false;
  
  matriculations: string[] = []; // Array para armazenar as matrículas
  filteredReserves: any[] = []; // Lista filtrada para exibição
  onlyActiveReserves: boolean = false;
  selectedMatricula: string = '';
  startDate: string = '';
  endDate: string = '';


  constructor(private reserveService: ReserveService, private cdr: ChangeDetectorRef, private vehicleService:VehicleService) {}

  ngOnInit(): void {

    this.loadMatriculations();
    this.loadPendings();

      this.reservesToEdit = this.isFormEditReserveVisible ? undefined : new Reserve();
      this.isFormEditReserveVisible = !this.isFormEditReserveVisible;
  }

  loadMatriculations(): void {
    this.vehicleService.getMatriculations().subscribe(
        (matriculations: string[]) => {
            // Você pode usar as matriculas diretamente aqui
            this.matriculations = matriculations;
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
  }

  loadPendings(): void {
    this.reserveService.getReserves()
      .subscribe((result: Reserve[]) => {
        this.reserves = result;
        this.sortReservesByState(); // Chame a função de classificação após atribuir as reservas
        this.filteredReserves = [...this.reserves];
        this.applyFilters();
    }, error => {
      console.error('Error fetching pendings:', error);
    });
  }
  
  // Inside your component class

  toggleActiveReserves(): void {
    console.log('Checkbox Active Reserves:', this.onlyActiveReserves);
    this.applyFilters();
  }

  applyFilters(): void {
    let startDate = this.startDate ? new Date(this.startDate) : null;
    let endDate = this.endDate ? new Date(this.endDate) : null;
  
    this.filteredReserves = this.reserves.filter(reserve => {
      const matchMatricula = !this.selectedMatricula || reserve.matriculation === this.selectedMatricula;
      const pendingStartDate = new Date(reserve.dateStart!);
      const pendingEndDate = new Date(reserve.dateEnd!);
      const matchStartDate = !startDate || pendingStartDate >= startDate;
      const matchEndDate = !endDate || pendingEndDate <= endDate;
      const isActive = reserve.state === 'ATIVA';
  
      return matchMatricula && matchStartDate && matchEndDate && (!this.onlyActiveReserves || isActive);
    });
  }
  

  sortReservesByState() {
    this.reserves.sort((a, b) => {
      const stateA = a.state ? a.state.toUpperCase() : '';
      const stateB = b.state ? b.state.toUpperCase() : '';
      if (stateA < stateB) {
        return -1;
      }
      if (stateA > stateB) {
        return 1;
      }
      return 0;
    });
  }

  editReserve(reserve: Reserve): void {
    console.log('editReserve triggered');
    this.reservesToEdit = reserve;
    this.isFormEditReserveVisible = !this.isFormEditReserveVisible;
  }

  updateReserveList(reserves: Reserve[]): void {
    console.log('updateReserveList triggered');
    this.reserves = reserves;
    this.cdr.detectChanges(); // Força a detecção de mudanças
    this.isFormEditReserveVisible = false;
  }

  fecharForm(){
    this.isFormEditReserveVisible = false;
  }

  clearDate(field: string) {
    if (field === 'startDate') {
        this.startDate = ''; // Alteração aqui
    } else if (field === 'endDate') {
        this.endDate = ''; // Alteração aqui
    }
    this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
  }
}
