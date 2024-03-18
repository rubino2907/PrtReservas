import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarReservasComponent } from './sidebar-reservas.component';

describe('SidebarReservasComponent', () => {
  let component: SidebarReservasComponent;
  let fixture: ComponentFixture<SidebarReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarReservasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
