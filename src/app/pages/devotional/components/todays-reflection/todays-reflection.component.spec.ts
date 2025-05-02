import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodaysReflectionComponent } from './todays-reflection.component';

describe('TodaysReflectionComponent', () => {
  let component: TodaysReflectionComponent;
  let fixture: ComponentFixture<TodaysReflectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TodaysReflectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodaysReflectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
