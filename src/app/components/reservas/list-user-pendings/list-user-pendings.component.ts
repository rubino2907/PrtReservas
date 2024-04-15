import { Component, OnInit } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { CookieService } from 'ngx-cookie-service';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-list-user-pendings',
  templateUrl: './list-user-pendings.component.html',
  styleUrls: ['./list-user-pendings.component.css']
})
export class ListUserPendingsComponent implements OnInit {
  pendings: Pending[] = [];
  sortColumn: string = 'aproved';
  sortDirection: string = 'desc'; // 'asc' para ascendente, 'desc' para descendente

  matriculations: string[] = []; // Array para armazenar as matrículas

  filteredPendings: any[] = []; // Lista filtrada para exibição
  selectedMatricula: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private cookieService: CookieService, private vehicleService: VehicleService, private pendantService: PendantService) { }

  ngOnInit(): void {
    // Chame o método do serviço para obter os pendentes do usuário
    this.getPendingsByCurrentUser();
    this.loadMatriculations();
  }

  clearDate(field: string) {
    if (field === 'startDate') {
        this.startDate = ''; // Alteração aqui
    } else if (field === 'endDate') {
        this.endDate = ''; // Alteração aqui
    }
    this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
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

  applyFilters(): void {
    // Converta as strings de data para objetos Date para comparação
    let startDate = this.startDate ? new Date(this.startDate) : null;
    let endDate = this.endDate ? new Date(this.endDate) : null;

    this.filteredPendings = this.pendings.filter(pending => {
      // Verificação de matrícula
      const matchMatricula = this.selectedMatricula ? pending.matriculation === this.selectedMatricula : true;

      // Conversão da data do pedido para objeto Date
      const pendingStartDate = pending.dateStart ? new Date(pending.dateStart) : new Date();
      const pendingEndDate = pending.dateEnd ? new Date(pending.dateEnd) : new Date();


      // Verificação de datas
      const matchStartDate = startDate ? pendingStartDate >= startDate : true;
      const matchEndDate = endDate ? pendingEndDate <= endDate : true;

      return matchMatricula && matchStartDate && matchEndDate;
    });
  }

  // Método para obter os pendentes do usuário atual
  getPendingsByCurrentUser(): void {
    // Substitua 'currentUser' pelo identificador do usuário atual
    const currentUser = this.cookieService.get('userName'); // Exemplo: 'username'
    
    this.pendantService.getPendingsByCreatedBy(currentUser).subscribe(
      (pendings: Pending[]) => {
        this.pendings = pendings;
        this.filteredPendings = [...this.pendings]; // Inicialize a lista filtrada com todos os pendentes
        this.applyFilters(); // Aplica qualquer filtro inicial se necessário
      },
      error => {
        console.error('Erro ao carregar pendentes:', error);
      }
    );
  }

  updatePendingList(pendings: Pending[]): void {
    this.pendings = pendings;
    this.filteredPendings = [...this.pendings];
  }

  // Método para ordenar a tabela com base no estado de aprovação
  sortTableByApproval(): void {
    // Alterne a direção da ordenação
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    
    // Atualize a coluna de ordenação para 'aproved'
    this.sortColumn = 'aproved';

    // Classifique os pendentes com base no estado de aprovação e na direção da ordenação
    this.filteredPendings.sort((a, b) => {
      // Verifica se 'a.aproved' e 'b.aproved' são definidos
      if (a.aproved !== undefined && b.aproved !== undefined) {
        if (this.sortDirection === 'asc') {
          return a.aproved.localeCompare(b.aproved);
        } else {
          return b.aproved.localeCompare(a.aproved);
        }
      }
      // Se 'a.aproved' ou 'b.aproved' não forem definidos, não é possível comparar
      // Então, retorna 0 para manter a ordem atual
      return 0;
    });
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
