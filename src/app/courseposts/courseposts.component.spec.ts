import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursepostsComponent } from './courseposts.component';

describe('CoursepostsComponent', () => {
  let component: CoursepostsComponent;
  let fixture: ComponentFixture<CoursepostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursepostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursepostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
