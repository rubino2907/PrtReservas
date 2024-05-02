import { Component, OnInit, LOCALE_ID, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { Reserve } from '../../../models/reserve';
import { addDays, addMinutes, addMonths, addWeeks, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { pt } from 'date-fns/locale'; // Importação do idioma local pt
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { PendantService } from '../../../services/pedidosService/pending.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';

@Component({
  selector: 'app-schedule-reserves',
  templateUrl: './schedule-reserves.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./schedule-reserves.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-PT' }]
})
export class ScheduleReservesComponent implements OnInit {
  pending: any; // Certifique-se de que a propriedade 'pending' esteja definida ou substitua pelo tipo apropriado
  isFormEditPendingVisible: boolean = true; // Defina a propriedade 'isFormEditPendingVisible'
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  view: 'Mês' | 'Dia' | 'Semana' = 'Mês'; // Alteração dos valores aqui
  views = ['Mês', 'Dia', 'Semana']; // Alteração dos valores aqui
  matriculations: string[] = []; // Lista de matrículas
  selectedMatriculation: string = ''; // Matrícula selecionada
  selectedMatriculations: { [matriculation: string]: boolean } = {};
  // Altere de private para public
  matriculationColors: { [matriculation: string]: string } = {};
  
  typeOfVehicles: string[] = []; // Array para armazenar os tipos

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private pendingService: PendantService,
    private reserveService: ReserveService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    private typeVehicleService: TypeVehicleService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.loadPendingData();
    this.loadTypeOfVehicles();
  }

  loadPendingData(): void {
    // Carregue os dados do formulário do serviço
    this.pendingService.getPendings().subscribe((data: any) => {
      this.pending = data;
    });
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

  loadMatriculations(vehicleType: string): void {
    this.vehicleService.getVehiclesByType(vehicleType).subscribe(
        (vehicles: Vehicle[]) => {
            this.matriculations = vehicles
                .filter(vehicle => !!vehicle.matriculation)
                .map(vehicle => `${vehicle.matriculation} | ${vehicle.descVehicle}`);
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
  }


  // Método para carregar as reservas por matrícula
  loadReservesByMatriculation(matriculations: string[]): void {
    console.log('Carregando reservas para as matrículas:', matriculations);
  
    // Extrair apenas a matrícula antes de fazer a solicitação
    const matriculationList = matriculations.map(matriculation => matriculation.split(" | ")[0]);
  
    this.events = []; // Limpa os eventos antes de adicionar as novas reservas
  
    this.reserveService.getReservesByMatriculationess(matriculationList)
      .subscribe((reserves: Reserve[]) => {
        console.log('Reservas recuperadas:', reserves);
  
        // Adiciona as reservas à lista de eventos
        reserves.forEach(reserve => {
          console.log('Adicionando reserva:', reserve);
          if (reserve.dateStart && reserve.dateEnd && reserve.matriculation && typeof reserve.matriculation === 'string') {
            const title = `
              <br><br>  
              <b>Matrícula:</b> ${reserve.matriculation} <br> 
              <b>Data Início:</b> ${this.formatDate(reserve.dateStart.toString())} <br>  
              <b>Data Fim:</b> ${this.formatDate(reserve.dateEnd.toString())} <br> 
              <b>Descrição:</b> ${reserve.description} <br> 
              <br> <br> `;

  
            // Verifica se já existe uma cor atribuída a esta matrícula
            if (!this.matriculationColors.hasOwnProperty(reserve.matriculation)) {
              // Se não houver, atribui uma cor nova
              this.matriculationColors[reserve.matriculation] = this.getRandomColor();
            }
  
            this.events.push({
              start: new Date(reserve.dateStart),
              end: new Date(reserve.dateEnd),
              title: title,
              color: {
                primary: this.matriculationColors[reserve.matriculation],
                secondary: this.matriculationColors[reserve.matriculation]
              }
            });
          }
        });
  
        // Emitir o evento de atualização
        this.refresh.emit();
  
        console.log('Eventos:', this.events); // Lista os eventos
      },
      (error) => {
        console.error('Erro ao carregar reservas:', error);
      });
  }
  


formatDate(date: string): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: pt });
}


getRandomColor(): string {
  // Lista de cores distintas
  const distinctColors = ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00'];

  // Filtra as cores que já foram atribuídas a outras matrículas
  const availableColors = distinctColors.filter(color => !Object.values(this.matriculationColors).includes(color));

  // Se houver cores disponíveis, retorna uma cor aleatória da lista de cores disponíveis
  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  // Se todas as cores já foram atribuídas, retorna uma cor aleatória da lista de cores distintas
  return distinctColors[Math.floor(Math.random() * distinctColors.length)];
}


  
  // Adiciona as reservas à lista de eventos
  addReservesToEvents(): void {
    // Verifica se há uma matrícula selecionada
    if (!this.selectedMatriculation) {
      return;
    }
  
    // Chama o serviço para obter as reservas da matrícula selecionada
    this.reserveService.getReservesByMatriculation(this.selectedMatriculation)
      .subscribe((reserves: Reserve[]) => {
        // Adiciona os eventos das reservas
        reserves.forEach(reserve => {
          if (reserve.dateStart && reserve.dateEnd) {
            this.events.push({
              start: new Date(reserve.dateStart),
              end: new Date(reserve.dateEnd),
              title: 'Reserva',
              color: { primary: 'red', secondary: 'red' }
            });
          }
        });
      });
  }
  
  
  // Verifica se há uma reserva para o dia especificado
  hasReserveForDay(day: Date): boolean {
    return this.events.some(event => {
      return event.start.getFullYear() === day.getFullYear() &&
        event.start.getMonth() === day.getMonth() &&
        event.start.getDate() === day.getDate();
    });
  }
  
  
  // Verifica se o dia está totalmente reservado
  isDayReserved(start: Date | undefined, end: Date | undefined): boolean {
    if (!start || !end) {
      return false;
    }
  
    const today = new Date(this.viewDate);
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return start <= startOfDay && end >= endOfDay;
  }

  selectedEvent: CalendarEvent | undefined;

  eventClicked(event: CalendarEvent): void {
    console.log('Evento clicado:', event);
    this.selectedEvent = event; // Define o evento selecionado para exibir na popup
    this.showPopupDescReserva = true; // Define showPopup como true para exibir a popup
    this.showPopup = false;
  }
  

  openPopup(event: CalendarEvent): void {
    // Aqui você pode abrir o popup com os detalhes da reserva
    // Você pode usar o NgbModal para abrir o popup
    // Consulte a documentação do NgbModal para mais detalhes sobre como usá-lo
  }

  setView(view: 'Mês' | 'Dia' | 'Semana'): void { // Alteração dos valores aqui
    this.view = view;

    // Limpa os eventos antes de carregar as reservas do novo dia
    this.events = [];

    this.loadReservesByMatriculation(this.matriculations)
  }
  
  next(): void {
  switch (this.view) {
    case 'Mês': // Alteração dos valores aqui
      this.viewDate = addMonths(this.viewDate, 1);
      break;
    case 'Semana': // Alteração dos valores aqui
      this.viewDate = addWeeks(this.viewDate, 1);
      break;
    case 'Dia': // Alteração dos valores aqui
      this.viewDate = addDays(this.viewDate, 1);
      break;
  }
  
  // Limpa os eventos antes de carregar as reservas do novo dia
  this.events = [];

  this.loadReservesByMatriculation(this.matriculations)
}

  
  previous(): void {
    switch (this.view) {
      case 'Mês': // Alteração dos valores aqui
        this.viewDate = subMonths(this.viewDate, 1);
        break;
      case 'Semana': // Alteração dos valores aqui
        this.viewDate = subWeeks(this.viewDate, 1);
        break;
      case 'Dia': // Alteração dos valores aqui
        this.viewDate = subDays(this.viewDate, 1);       
         break;
      }

      // Limpa os eventos antes de carregar as reservas do novo dia
      this.events = [];

      this.loadReservesByMatriculation(this.matriculations)
    }
  
    getIndicator(): string {
      switch (this.view) {
        case 'Mês': // Alteração dos valores aqui
          return format(this.viewDate, 'MMMM yyyy', { locale: pt });
        case 'Semana': // Alteração dos valores aqui
          return `${format(startOfWeek(this.viewDate), 'd MMMM', { locale: pt })} - ${format(endOfWeek(this.viewDate), 'd MMMM', { locale: pt })}`;
        case 'Dia': // Alteração dos valores aqui
          return format(this.viewDate, 'd MMMM yyyy HH:mm', { locale: pt });
        default:
          return '';
      }
    }
    
    clearReservations(): void {
      this.events = []; // Limpa a lista de eventos
      this.pending = {}; // Limpa os dados do formulário
      this.selectedMatriculation = ''; // Limpa a matrícula selecionada
      this.matriculations = [];
      this.matriculationColors = {}; // Limpa as cores das matrículas
    }
    

    onSave(): void {
      // Obtenha a lista de matrículas selecionadas
      const selectedMatriculationsList = Object.keys(this.selectedMatriculations).filter(matriculation => this.selectedMatriculations[matriculation]);
      
      // Verifique se o número de matrículas selecionadas excede 5
      if (selectedMatriculationsList.length > 5) {
        // Exibe um snackbar com a mensagem de aviso
        this.snackBar.open('Você já selecionou o número máximo de matrículas (5).', 'Fechar', {
          duration: 3000 // Duração em milissegundos
        });
        return;
      }
    
      this.matriculations = selectedMatriculationsList
    
      this.closePopupe();
    
      // Limpa os eventos antes de carregar as reservas do novo dia
      this.events = [];
    
      // Carrega as reservas apenas para as matrículas selecionadas
      this.loadReservesByMatriculation(this.matriculations);
    }
    


    showPopup: boolean = false;
    showPopupDescReserva: boolean = false;
    showPopupLegendaMatriculas: boolean = false;

    openPopupe(): void {
      this.showPopup = true;
      this.showPopupDescReserva = false;
    }

    openPopupLegendaMatriculas(): void {
      this.showPopupLegendaMatriculas = true;
    }
    
    closePopupLegendaMatriculas(): void {
      this.showPopupLegendaMatriculas = false;
    }
    
    closePopupe(): void {
      // Limpar as matrículas selecionadas
      this.selectedMatriculations = {};
    
      // Fechar a popup
      this.showPopup = false;
    }
    
    closePopupDescReserva(): void {
      this.showPopupDescReserva = false;
    }
    


  }
