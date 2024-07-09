import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursestudentsComponent } from './coursestudents.component';

describe('CoursestudentsComponent', () => {
  let component: CoursestudentsComponent;
  let fixture: ComponentFixture<CoursestudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursestudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursestudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
