import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';

@Component({
  selector: 'app-create-reserva',
  templateUrl: './create-reserva.component.html',
  styleUrls: ['./create-reserva.component.css']
})
export class CreateReservaComponent  implements OnInit{

  @Input() pending?: Pending;
  @Output() pendingsUpdated = new EventEmitter<Pending[]>();
  matriculations: string[] = [];
  @Output() reservesUpdated = new EventEmitter<Reserve[]>();

  constructor(private vehicleService: VehicleService, private pendantService: PendantService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.carregarMatriculas();
  }

  carregarMatriculas(): void {
    this.vehicleService.getMatriculations().subscribe(
      matriculas => {
        this.matriculations = matriculas;
      },
      error => {
        console.log('Erro ao carregar as matrículas:', error);
      }
    );
  }

  createPending(newPending: Pending): void {
    console.log("Pendente antes de ser enviado:", newPending);
    
    newPending.createdBy = this.cookieService.get('userName');
    newPending.changeDateTime = "";
    newPending.creationDateTime = "";
    newPending.aproved = false;
    newPending.aprovedBy = this.cookieService.get('userName');
    
    this.pendantService
      .createPending(newPending)
      .subscribe(
        (pendants: Pending[]) => {
          console.log("Pendentes criados com sucesso!", pendants);
          this.pendingsUpdated.emit(pendants);
        },
        (error) => {
          console.error("Erro ao criar Pendentes:", error);
          if (error && error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                console.error(`Erro de validação no campo ${field}: ${validationErrors[field]}`);
              }
            }
          } else if (error && error.message) {
            console.error("Mensagem de erro:", error.message);
          }
        }
      );
  }
}
