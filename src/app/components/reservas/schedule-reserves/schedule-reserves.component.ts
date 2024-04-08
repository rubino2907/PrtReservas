import { Component, OnInit, LOCALE_ID, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { addDays, addMinutes, addMonths, addWeeks, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
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
  view: 'Mês' | 'Dia' | 'Semana' = 'Mês'; // Alteração dos valores aqui
  views = ['Mês', 'Dia', 'Semana']; // Alteração dos valores aqui
  matriculations: string[] = []; // Lista de matrículas
  selectedMatriculation: string = ''; // Matrícula selecionada
  selectedMatriculations: { [matriculation: string]: boolean } = {};
  matriculationColors: { [matriculation: string]: string } = {};
  
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

loadReservesByMatriculation(matriculations: string[]): void {
  console.log('Carregando reservas para as matrículas:', matriculations);

  this.events = []; // Limpa os eventos antes de adicionar as novas reservas

  this.reserveService.getReservesByMatriculationess(matriculations)
    .subscribe((reserves: Reserve[]) => {
      console.log('Reservas recuperadas:', reserves);

      // Limpa as cores das matrículas
      this.matriculationColors = {};

      // Adiciona as reservas à lista de eventos
      reserves.forEach(reserve => {
        console.log('Adicionando reserva:', reserve);
        if (reserve.dateStart && reserve.dateEnd && reserve.matriculation && typeof reserve.matriculation === 'string') {
          const title = ` Matrícula: ${reserve.matriculation} | Descrição: ${reserve.description} | Criado por: ${reserve.createdBy}`;

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
      // Atualiza o calendário para refletir as novas reservas
      this.loadAvailableDays();
    },
    (error) => {
      console.error('Erro ao carregar reservas:', error);
    });
}

getRandomColor(): string {
  // Gera uma cor hexadecimal aleatória em tons mais claros
  const letters = '0123456789ABCDEF';
  let color;
  
  do {
    color = '#';
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 6) + 9];
    }
  } while (color === '#A5D6A7'); // Repete a geração da cor se ela for #A5D6A7

  return color;
}




loadAvailableDays(): void {
  this.events = this.events.filter(event => {
    // Remova eventos 'Dia Livre' anteriormente adicionados
    return event.title !== 'Dia Livre';
  });

  let startInterval: Date;
  let endInterval: Date;

  if (this.view === 'Mês') {
    startInterval = startOfMonth(this.viewDate);
    endInterval = endOfMonth(this.viewDate);
  } else if (this.view === 'Semana') {
    startInterval = startOfWeek(this.viewDate, { weekStartsOn: 1 });
    endInterval = endOfWeek(this.viewDate, { weekStartsOn: 1 });
  } else { // Dia
    startInterval = startOfDay(this.viewDate);
    endInterval = endOfDay(this.viewDate);
  }

  let allDays = eachDayOfInterval({ start: startInterval, end: endInterval });

  allDays.forEach(day => {
    let dayStart = startOfDay(day);
    let dayEnd = endOfDay(day);
    let isDayFree = !this.events.some(event => {
      if (!event.start || !event.end) return false; // Garanta que start e end não são undefined

      let eventStart = startOfDay(event.start);
      let eventEnd = endOfDay(event.end);
      return (dayStart >= eventStart && dayStart <= eventEnd) || (dayEnd >= eventStart && dayEnd <= eventEnd);
    });

    if (isDayFree) {
      this.events.push({
        start: dayStart,
        end: dayEnd,
        title: 'Dia Livre',
        color: {
          primary: '#A5D6A7', // Cor verde clara
          secondary: '#A5D6A7'
        }
      });
    }
  });

  this.refresh.emit();
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
    this.loadAvailableDays(); // Carrega os dias disponíveis ao mudar a visualização do calendário

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

  // Carrega as reservas do novo dia
  this.loadAvailableDays();
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

      this.loadAvailableDays(); // Carrega os dias disponíveis após retroceder na visualização do calendário
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
    showPopupDescReserva: boolean = false;

    openPopupe(): void {
      this.showPopup = true;
      this.showPopupDescReserva = false;
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
