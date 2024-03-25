import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { addDays, addMonths, addWeeks, endOfWeek, format, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { pt } from 'date-fns/locale'; // Importação do idioma local pt
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-schedule-reserves',
  templateUrl: './schedule-reserves.component.html',
  styleUrls: ['./schedule-reserves.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-PT' }]
})
export class ScheduleReservesComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  view: 'month' | 'day' | 'week' = 'month';
  views = ['month', 'day', 'week'];
  matriculations: string[] = []; // Lista de matrículas
  selectedMatriculation: string = ''; // Matrícula selecionada

  constructor(
    private reserveService: ReserveService,
    private vehicleService: VehicleService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.loadMatriculations(); // Carrega as matrículas ao inicializar o componente
    this.loadReservesByMatriculation(); // Carrega as reservas ao inicializar o componente
  }

  loadMatriculations(): void {
    // Carrega as matrículas do serviço VehicleService
    this.vehicleService.getMatriculations().subscribe(matriculations => {
      this.matriculations = matriculations;
      this.loadAvailableDays(); // Carrega os dias disponíveis ao carregar as matrículas
    });
  }

  loadAvailableDays(): void {
    // Verifica se há uma matrícula selecionada
    if (!this.selectedMatriculation) {
      return;
    }
  
    // Chama o serviço para obter os dias disponíveis com base na matrícula selecionada
    this.reserveService.getAvailableDays(this.selectedMatriculation, this.viewDate, endOfWeek(this.viewDate))
      .subscribe((availableDays: Date[]) => {
        // Adiciona as reservas após adicionar os dias disponíveis
        this.addReservesToEvents();
  
        // Adiciona os eventos para os dias disponíveis com a bola verde
        availableDays.forEach(day => {
          // Verifica se o dia não tem reservas
          if (!this.hasReserveForDay(day)) {
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
  
  loadReservesByMatriculation(): void {
    // Verifica se há uma matrícula selecionada
    if (!this.selectedMatriculation) {
      return;
    }
  
    // Chama o serviço para obter as reservas da matrícula selecionada
    this.reserveService.getReservesByMatriculation(this.selectedMatriculation)
      .subscribe((reserves: Reserve[]) => {
        // Limpa os eventos antes de adicionar as reservas
        this.events = [];
  
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
  
        this.loadAvailableDays(); // Carrega os dias disponíveis após carregar as reservas
      });
  }
  

  eventClicked(event: CalendarEvent): void {
    console.log('Evento clicado:', event);
  }

  setView(view: 'month' | 'day' | 'week'): void {
    this.view = view;
    this.loadAvailableDays(); // Carrega os dias disponíveis ao mudar a visualização do calendário
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
    this.loadAvailableDays(); // Carrega os dias disponíveis após avançar na visualização do calendário
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
}
