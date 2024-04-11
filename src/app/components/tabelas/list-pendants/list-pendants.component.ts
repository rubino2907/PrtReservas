import { Component, Input, OnInit } from '@angular/core';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';
import { UserService } from '../../../services/user.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle';
import { UserDetails } from '../../../models/UserModels/userDetails';

@Component({
  selector: 'app-list-pendants',
  templateUrl: 'list-pendants.component.html', // Apenas o nome do arquivo
  styleUrls: ['./list-pendants.component.css']
})

export class ListPendantsComponent implements OnInit {
  @Input() pendings: Pending[] = [];
  @Input() pendingsToEdit?: Pending;
  @Input() isFormEditPendingVisible: boolean = false;
  userDetails?: UserDetails;
  matriculations: string[] = []; // Array para armazenar as matrículas

  filteredPendings: any[] = []; // Lista filtrada para exibição
  selectedMatricula: string = '';
  startDate: string = '';
  endDate: string = '';


  // Variável para acompanhar a linha selecionada
  selectedPending: any = null;

  constructor(private pendantService: PendantService, private userService: UserService, private vehicleService:VehicleService) {}

  ngOnInit(): void {
    this.loadPendings();
    this.loadMatriculations();
  }

  loadPendings(): void {
    this.pendantService.getPendings()
      .subscribe((result: Pending[]) => {
        // Classifique os pedidos de acordo com o estado, colocando "EM ESPERA" primeiro
        result.sort((a, b) => {
          if (a.aproved === 'EM ESPERA' && b.aproved !== 'EM ESPERA') {
            return -1; // "EM ESPERA" vem antes de outros estados
          } else if (a.aproved !== 'EM ESPERA' && b.aproved === 'EM ESPERA') {
            return 1; // Outros estados vêm depois de "EM ESPERA"
          } else {
            return 0; // Mantém a ordem atual entre pedidos com o mesmo estado
          }
        });
  
        this.pendings = result;
        this.filteredPendings = [...this.pendings]; // Inicialize a lista filtrada com todos os pendentes
        this.applyFilters(); // Aplica qualquer filtro inicial se necessário
    }, error => {
      console.error('Error fetching pendings:', error);
    });
  
    this.isFormEditPendingVisible = false;
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


  initNewPending(): void {
    // Limpar os detalhes do usuário
    this.userDetails = undefined;
    this.pendingsToEdit = this.isFormEditPendingVisible ? undefined : new Pending();
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
  
    // Chama o serviço para obter a lista atualizada de pendentes após adicionar um novo pendente
    this.pendantService.getPendings().subscribe((result: Pending[]) => {
      this.pendings = result;
      console.log('Pendings after addition:', this.pendings);
      
    });
  }


  editPending(pending: Pending): void {
    this.pendingsToEdit = pending;
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
    const createdBy = pending.createdBy;
  
    if (createdBy) {
      this.userService.getUserDetailsByCreatedBy(createdBy).subscribe(
        (userData: UserDetails) => {
          this.userDetails = userData;
          // Coloque o código HTML dentro deste bloco
        },
        (error) => {
          console.error('Ocorreu um erro ao buscar os detalhes do usuário:', error);
        }
      );
    } else {
      console.error('O campo createdBy está undefined.');
    }

    // Remova o código HTML fora deste bloco
}

  

  updatePendingList(pendings: Pending[]): void {
    this.pendings = pendings;
    this.isFormEditPendingVisible = false;
  }

  fecharForm(): void {
    // Limpar os detalhes do usuário
    this.userDetails = undefined;

    // Limpar o pendingsToEdit
    this.pendingsToEdit = undefined;

    // Ocultar o formulário de edição
    this.isFormEditPendingVisible = false;
  }

  // Função para selecionar a linha clicada
  selectPending(pending: any) {
    this.selectedPending = pending;
    console.log('Selected Pending:', this.selectedPending); // Adicione este console log para verificar se a linha está sendo selecionada corretamente
  }

  // Função para retornar a classe com base no estado do pedido
  getPendingStatusClass(status: string | undefined): string {
    if (status === 'APROVADO') {
      return 'approved';
    } else if (status === 'EM ESPERA') {
      return 'pending';
    } else if (status === 'NÃO APROVADO') {
      return 'not-approved';
    } else {
      return ''; // Retorna uma string vazia se o status for undefined
    }
  }

  
  
}
