import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { PendantService } from '../../../services/pending.service';
import { CookieService } from 'ngx-cookie-service';
import { Reserve } from '../../../models/reserve';
import { ReserveService } from '../../../services/reserve.service';

@Component({
  selector: 'app-aprove-pendings',
  templateUrl: './aprove-pendings.component.html',
  styleUrl: './aprove-pendings.component.css'
})
export class AprovePendingsComponent implements OnInit {
  @Input() pendings: Pending[] = [];
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();


  constructor(private cookieService: CookieService, private reserveService: ReserveService, private pendantService: PendantService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendingsByAproved()
      .subscribe((result: Pending[]) => {
        this.pendings = result;
      });
  }

  approvePending(pending: Pending): void {
    // Verifica se o estado do pedido não é 'APROVADO'
    if (pending.aproved !== 'APROVADO') {
      // Altera o estado do pedido para 'APROVADO'
      pending.aproved = 'APROVADO';
      pending.aprovedBy = this.cookieService.get('userName');
  
      // Envia a solicitação para atualizar o estado do pedido
      this.pendantService
        .updatePendings(pending)
        .subscribe((pendants: Pending[]) => {
          // Emite o evento para informar que os pendentes foram atualizados
          this.pendingsUpdated.emit(pendants);
  
          // Verifica se o pedido foi aprovado
          if (pending.aproved === 'APROVADO') {
            // Se aprovado, cria a reserva
            const reserve: Reserve = {
              createdBy: pending.createdBy,
              creationDateTime: pending.creationDateTime,
              changeDateTime: pending.changeDateTime,
              dateStart: pending.dateStart,
              dateEnd: pending.dateEnd,
              description: pending.description,
              matriculation: pending.matriculation,
              state: 'ATIVA',
              obs: ''
            };
  
            this.reserveService
              .createReserve(reserve)
              .subscribe(
                (reserves: Reserve[]) => {
                  console.log("Reserva criada com sucesso!", reserves);
                  // Recarrega os pendentes após a aprovação do pedido
                  this.loadPendings();
                },
                (error) => {
                  console.error("Erro ao criar Reserva:", error);
                  // Lide com os erros adequadamente
                }
              );
          }
        });
    }
  }
  
  deletePending(pending: Pending): void {
    this.pendantService
      .deletePendings(pending)
      .subscribe((pendants: Pending[]) => {
        this.pendingsUpdated.emit(pendants);
        this.loadPendings();
      });
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
