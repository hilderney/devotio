import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainCardComponent } from './main-card.component';

describe('CardPrincipalComponent', () => {
  let component: MainCardComponent;
  let fixture: ComponentFixture<MainCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MainCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
