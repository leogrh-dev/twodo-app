import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGroupNotesModalComponent } from './all-group-notes-modal.component';

describe('AllGroupNotesModalComponent', () => {
  let component: AllGroupNotesModalComponent;
  let fixture: ComponentFixture<AllGroupNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGroupNotesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGroupNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
