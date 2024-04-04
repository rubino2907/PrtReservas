import { Component, OnInit, LOCALE_ID, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { addDays, addMonths, addWeeks, endOfWeek, format, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { pt } from 'date-fns/locale'; // Importação do idioma local pt
import { VehicleService } from '../../../services/vehicle.service';
import { PendantService } from '../../../services/pending.service';
import { Vehicle } from '../../../models/vehicle';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  view: 'month' | 'day' | 'week' = 'month';
  views = ['month', 'day', 'week'];
  matriculations: string[] = []; // Lista de matrículas
  selectedMatriculation: string = ''; // Matrícula selecionada
  selectedMatriculations: { [matriculation: string]: boolean } = {};
  
  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private pendingService: PendantService,
    private reserveService: ReserveService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.loadPendingData();
    this.loadReservesByMatriculation(this.matriculations)
  }

  loadPendingData(): void {
    // Carregue os dados do formulário do serviço
    this.pendingService.getPendings().subscribe((data: any) => {
      this.pending = data;
    });
  }

  loadMatriculations(vehicleType: string): void {
    this.vehicleService.getVehiclesByType(vehicleType).subscribe(
        (vehicles: Vehicle[]) => {
            this.matriculations = vehicles
                .filter(vehicle => !!vehicle.matriculation)
                .map(vehicle => vehicle.matriculation!);
        },
        (error) => {
            console.error("Erro ao carregar matrículas por tipo:", error);
            // Lide com os erros adequadamente
        }
    );
}

// Defina um array de cores predefinidas
private vehicleColors: string[] = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF'];

loadReservesByMatriculation(matriculations: string[]): void {
  console.log('Carregando reservas para as matrículas:', matriculations);

  this.events = []; // Limpa os eventos antes de adicionar as novas reservas

  // Variável para controlar o índice da cor a ser usada
  let colorIndex = 0;

  this.reserveService.getReservesByMatriculationess(matriculations)
    .subscribe((reserves: Reserve[]) => {
      console.log('Reservas recuperadas:', reserves);

      // Adiciona as reservas à lista de eventos
      reserves.forEach(reserve => {
        console.log('Adicionando reserva:', reserve);
        if (reserve.dateStart && reserve.dateEnd) {
          // Formata as datas de início e fim para exibir no título

          // Concatena as datas formatadas para exibir no título
          const title = `${reserve.matriculation} - ${reserve.description}`;

          // Obtém a cor do array de cores predefinidas
          const color: any = {
            primary: this.vehicleColors[colorIndex],
            secondary: this.vehicleColors[colorIndex]
          };

          // Incrementa o índice da cor para a próxima viatura
          colorIndex = (colorIndex + 1) % this.vehicleColors.length;

          this.events.push({
            start: new Date(reserve.dateStart),
            end: new Date(reserve.dateEnd),
            title: title,
            color: color
          });
        }
      });

      // Emitir o evento de atualização
      this.refresh.emit();

      console.log('Eventos:', this.events); // Lista os eventos

      // Atualiza o calendário para refletir as novas reservas
      this.loadAvailableDays();
    },
    (error) => {
      console.error('Erro ao carregar reservas:', error);
    });
}





loadAvailableDays(): void {
    if (!this.selectedMatriculation) {
      return;
    }

    this.reserveService.getAvailableDays(this.selectedMatriculation, this.viewDate, endOfWeek(this.viewDate))
      .subscribe((availableDays: Date[]) => {
        const isFullDayReserved = availableDays.every(day => this.hasReserveForDay(day));
  
        availableDays.forEach(day => {
          if (isFullDayReserved) {
            this.events.push({
              start: day,
              title: 'Dia Preenchido',
              color: { primary: 'blue', secondary: 'blue' }
            });
          } else if (!this.hasReserveForDay(day)) {
            this.events.push({
              start: day,
              title: 'Dia Livre',
              color: { primary: 'green', secondary: 'green' }
            });
          }
        });
      });
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

  eventClicked(event: CalendarEvent): void {
    console.log('Evento clicado:', event);
    this.openPopup(event); // Chame a função para abrir o popup aqui
  }

  openPopup(event: CalendarEvent): void {
    // Aqui você pode abrir o popup com os detalhes da reserva
    // Você pode usar o NgbModal para abrir o popup
    // Consulte a documentação do NgbModal para mais detalhes sobre como usá-lo
  }

  setView(view: 'month' | 'day' | 'week'): void {
    this.view = view;
    this.loadAvailableDays(); // Carrega os dias disponíveis ao mudar a visualização do calendário

    // Limpa os eventos antes de carregar as reservas do novo dia
    this.events = [];

    this.loadReservesByMatriculation(this.matriculations)
  }
  
  next(): void {
  switch (this.view) {
    case 'month':
      this.viewDate = addMonths(this.viewDate, 1);
      break;
    case 'week':
      this.viewDate = addWeeks(this.viewDate, 1);
      break;
    case 'day':
      this.viewDate = addDays(this.viewDate, 1);
      break;
  }
  
  // Limpa os eventos antes de carregar as reservas do novo dia
  this.events = [];

  this.loadReservesByMatriculation(this.matriculations)

  // Carrega as reservas do novo dia
  this.loadAvailableDays();
}

  
  previous(): void {
    switch (this.view) {
      case 'month':
        this.viewDate = subMonths(this.viewDate, 1);
        break;
      case 'week':
        this.viewDate = subWeeks(this.viewDate, 1);
        break;
      case 'day':
        this.viewDate = subDays(this.viewDate, 1);       
         break;
      }

      // Limpa os eventos antes de carregar as reservas do novo dia
      this.events = [];

      this.loadReservesByMatriculation(this.matriculations)

      this.loadAvailableDays(); // Carrega os dias disponíveis após retroceder na visualização do calendário
    }
  
    getIndicator(): string {
      switch (this.view) {
        case 'month':
          return format(this.viewDate, 'MMMM yyyy', { locale: pt });
        case 'week':
          return `${format(startOfWeek(this.viewDate), 'd MMMM', { locale: pt })} - ${format(endOfWeek(this.viewDate), 'd MMMM', { locale: pt })}`;
        case 'day':
          return format(this.viewDate, 'd MMMM yyyy HH:mm', { locale: pt });
        default:
          return '';
      }
    }
    
    clearReservations(): void {
      this.events = []; // Limpa a lista de eventos
      this.pending = {}; // Limpa os dados do formulário
      this.selectedMatriculation = ''; // Limpa a matrícula selecionada
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
      
      // Continue com a lógica existente
      console.log('Matrículas selecionadas:', selectedMatriculationsList);
    
      this.matriculations = selectedMatriculationsList
    
      this.closePopupe();
    
      // Limpa os eventos antes de carregar as reservas do novo dia
      this.events = [];
    
      // Carrega as reservas apenas para as matrículas selecionadas
      this.loadReservesByMatriculation(this.matriculations);
    }
    


    showPopup: boolean = false;

    openPopupe(): void {
      this.showPopup = true;
    }

    closePopupe(): void {
      // Limpar as matrículas selecionadas
      this.selectedMatriculations = {};
    
      // Fechar a popup
      this.showPopup = false;
    }


  }
  
       
