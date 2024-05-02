import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateGestaoService {
  private activeItemSource = new BehaviorSubject<string>('');

  // Observable active item stream
  activeItem = this.activeItemSource.asObservable();

  // service command to update the active item
  changeActiveItem(item: string) {
    this.activeItemSource.next(item);
  }
}
    