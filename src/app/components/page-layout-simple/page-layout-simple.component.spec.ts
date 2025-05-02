import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutSimpleComponent } from './page-layout-simple.component';

describe('PageLayoutSimpleComponent', () => {
  let component: PageLayoutSimpleComponent;
  let fixture: ComponentFixture<PageLayoutSimpleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PageLayoutSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLayoutSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
