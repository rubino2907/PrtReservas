import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
    private hideOptionsSubject = new BehaviorSubject<boolean>(false);
    hideOptions$ = this.hideOptionsSubject.asObservable();
  
    constructor() { }
  
    hideOptions(): void {
      this.hideOptionsSubject.next(true); // Emitir o valor true para indicar que as opções devem ser ocultadas
    }
}
