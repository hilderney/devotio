import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodaysVerseComponent } from './todays-verse.component';

describe('TodaysReflectionComponent', () => {
  let component: TodaysVerseComponent;
  let fixture: ComponentFixture<TodaysVerseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TodaysVerseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodaysVerseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
