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
    this.loadReserves(); // Carrega as reservas ao inicializar o componente
  }

  loadMatriculations(): void {
    // Aqui você carrega as matrículas do serviço ReserveService
    // Supondo que o serviço tem um método getMatriculations()
    this.vehicleService.getMatriculations().subscribe(matriculations => {
      this.matriculations = matriculations;
    });
  }

  loadReserves(): void {
    if (this.selectedMatriculation) {
      // Se uma matrícula estiver selecionada, carrega as reservas dessa matrícula
      this.reserveService.getReservesByMatriculation(this.selectedMatriculation).subscribe(
        (reserves: Reserve[]) => {
          this.events = reserves.map((reserve, index) => ({
            start: reserve.dateStart ? new Date(reserve.dateStart) : new Date(),
            end: reserve.dateEnd ? new Date(reserve.dateEnd) : new Date(),
            title: reserve.matriculation || 'Sem Matrícula associada',
            color: this.getColorByIndex(index)
          }));
        },
        error => {
          console.error('Erro ao carregar reservas:', error);
        }
      );
    } else {
      // Se nenhuma matrícula estiver selecionada, carrega todas as reservas
      this.reserveService.getReserves().subscribe(
        (reserves: Reserve[]) => {
          this.events = reserves.map((reserve, index) => ({
            start: reserve.dateStart ? new Date(reserve.dateStart) : new Date(),
            end: reserve.dateEnd ? new Date(reserve.dateEnd) : new Date(),
            title: reserve.matriculation || 'Sem Matrícula associada',
            color: this.getColorByIndex(index)
          }));
        },
        error => {
          console.error('Erro ao carregar reservas:', error);
        }
      );
    }
  }

  getColorByIndex(index: number): any {
    const colors = ['blue', 'green', 'red', 'orange', 'purple'];
    const colorIndex = index % colors.length;
    return {
      primary: colors[colorIndex],
      secondary: colors[colorIndex]
    };
  }

  eventClicked(event: CalendarEvent): void {
    console.log('Evento clicado:', event);
  }

  setView(view: 'month' | 'day' | 'week'): void {
    this.view = view;
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
