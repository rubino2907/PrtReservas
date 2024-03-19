import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReserveService } from '../../../services/reserve.service';
import { Reserve } from '../../../models/reserve';
import { addDays, addMonths, addWeeks, endOfWeek, format, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';

@Component({
  selector: 'app-schedule-reserves',
  templateUrl: './schedule-reserves.component.html',
  styleUrls: ['./schedule-reserves.component.css']
})
export class ScheduleReservesComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  view: 'month' | 'day' | 'week' = 'month'; // Variável para controlar a visualização inicial

  constructor(private reserveService: ReserveService) {}

  ngOnInit(): void {
    this.loadReserves();
  }

  loadReserves(): void {
    this.reserveService.getReserves().subscribe(
      (reserves: Reserve[]) => {
        this.events = reserves.map((reserve, index) => ({
          start: reserve.dateStart ? new Date(reserve.dateStart) : new Date(),
          end: reserve.dateEnd ? new Date(reserve.dateEnd) : new Date(),
          title: reserve.matriculation || 'Sem Matricula associado',
          color: this.getColorByIndex(index) // Define a cor com base no índice da reserva
        }));
      },
      error => {
        console.error('Erro ao carregar reservas:', error);
      }
    );
  }
  
  getColorByIndex(index: number): any {
    const colors = ['blue', 'green', 'red', 'orange', 'purple']; // Array de cores disponíveis
    const colorIndex = index % colors.length; // Calcula o índice da cor com base no índice da reserva e no número de cores disponíveis
    return {
      primary: colors[colorIndex],
      secondary: colors[colorIndex]
    };
  }
  

  eventClicked(event: CalendarEvent): void {
    console.log('Evento clicado:', event);
    // Aqui você pode adicionar a lógica para lidar com o evento clicado
  }

  setView(view: 'month' | 'day' | 'week'): void {
    this.view = view;
  }

  // Função para avançar para a próxima data
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

  // Função para voltar para a data anterior
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
        return format(this.viewDate, 'MMMM yyyy');
      case 'week':
        return `${format(startOfWeek(this.viewDate), 'd MMMM')} - ${format(endOfWeek(this.viewDate), 'd MMMM')}`;
      case 'day':
        return format(this.viewDate, 'd MMMM yyyy');
      default:
        return '';
    }
  }
}
