import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetasksComponent } from './coursetasks.component';

describe('CoursetasksComponent', () => {
  let component: CoursetasksComponent;
  let fixture: ComponentFixture<CoursetasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursetasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursetasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
