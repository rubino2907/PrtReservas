import { Component, Input, OnInit } from '@angular/core';
import { Reserve } from '../../../models/reserve';
import { ReserveService } from '../../../services/reserve.service';

@Component({
  selector: 'app-list-reserves',
  templateUrl: './list-reserves.component.html',
  styleUrl: './list-reserves.component.css'
})
export class ListReservesComponent implements OnInit {

  @Input() reserves: Reserve[] = [];
  @Input() reservesToEdit?: Reserve;
  @Input() isFormEditReserveVisible: boolean = false;

  constructor(private reserveService: ReserveService) {}

  ngOnInit(): void {
    console.log('ngOnInit triggered');
    this.reserveService.getReserves()
      .subscribe((result: Reserve[]) => {
        this.reserves = result;
        console.log('Reserves retrieved:', this.reserves);
        this.sortReservesByState(); // Chamando a função de ordenação ao inicializar os dados
      }, error => {
        console.error('Error fetching reserves:', error);
      });

    this.isFormEditReserveVisible = false;
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

  initNewReserva(){
    console.log('initNewReserva triggered');
    this.reservesToEdit = this.isFormEditReserveVisible ? undefined : new Reserve();
    this.isFormEditReserveVisible = !this.isFormEditReserveVisible;
  
    // Chama o serviço para obter a lista atualizada de veículos após adicionar um novo veículo
    this.reserveService.getReserves().subscribe((result: Reserve[]) => {
      this.reserves = result;
      console.log('Reserves after addition:', this.reserves);
      this.sortReservesByState(); // Chamando a função de ordenação após adicionar nova reserva
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
    this.isFormEditReserveVisible = false;
  }

  fecharForm(){
    this.isFormEditReserveVisible = false;
  }
}
