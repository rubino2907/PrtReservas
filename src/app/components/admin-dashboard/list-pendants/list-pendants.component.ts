import { Component, Input, OnInit } from '@angular/core';
import { PendantService } from '../../../services/pending.service';
import { Pending } from '../../../models/pending';

@Component({
  selector: 'app-list-pendants',
  templateUrl: './list-pendants.component.html',
  styleUrls: ['./list-pendants.component.css']
})
export class ListPendantsComponent implements OnInit {

  @Input() pendings: Pending[] = [];
  @Input() pendingsToEdit?: Pending;
  @Input() isFormEditPendingVisible: boolean = false;

  constructor(private pendantService: PendantService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  loadPendings(): void {
    this.pendantService.getPendings()
      .subscribe((result: Pending[]) => {
        this.pendings = result;
      }, error => {
        console.error('Error fetching pendings:', error);
      });

    this.isFormEditPendingVisible = false;
  }

  initNewPending(): void {
    this.pendingsToEdit = this.isFormEditPendingVisible ? undefined : new Pending();
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
  
    // Chama o serviço para obter a lista atualizada de pendentes após adicionar um novo pendente
    this.pendantService.getPendings().subscribe((result: Pending[]) => {
      this.pendings = result;
      console.log('Pendings after addition:', this.pendings);
    });
  }

  editPending(pending: Pending): void {
    this.pendingsToEdit = pending;
    this.isFormEditPendingVisible = !this.isFormEditPendingVisible;
  }

  updatePendingList(pendings: Pending[]): void {
    this.pendings = pendings;
    this.isFormEditPendingVisible = false;
  }
  
}
