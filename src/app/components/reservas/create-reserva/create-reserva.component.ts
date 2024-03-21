import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { Reserve } from '../../../models/reserve';
import { CookieService } from 'ngx-cookie-service';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importando MatSnackBar para exibir mensagens de erro

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

  constructor(private vehicleService: VehicleService, private pendantService: PendantService, private cookieService: CookieService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  createPending(newPending: Pending): void {
    console.log("Pendente antes de ser enviado:", newPending);
  
    newPending.createdBy = this.cookieService.get('userName');
    
    // Convertendo a string para um objeto Date
    newPending.changeDateTime = new Date(); // criando um novo objeto Date com a data atual
    newPending.creationDateTime = new Date(); // criando um novo objeto Date com a data atual
    newPending.matriculation = "";
    newPending.aproved = "EM ESPERA";
    newPending.aprovedBy = this.cookieService.get('userName');
    
    this.pendantService
      .createPendingWithType(newPending)
      .subscribe(
        (pendants: Pending[]) => {
          console.log("Pendentes criados com sucesso!", pendants);
          this.pendingsUpdated.emit(pendants);
          // Limpar o formulário
          this.pending = new Pending(); // Ou qualquer outra forma de criar um novo objeto vazio
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
          // Exibir mensagem de erro
          this.snackBar.open('Impossível criar pedido. Nenhuma viatura está disponível para essa data.', 'Fechar', {
            duration: 5000, // Duração em milissegundos
          });
        }
      );
  }
}
