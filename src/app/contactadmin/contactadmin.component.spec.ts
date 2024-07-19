import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactadminComponent } from './contactadmin.component';

describe('ContactadminComponent', () => {
  let component: ContactadminComponent;
  let fixture: ComponentFixture<ContactadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
