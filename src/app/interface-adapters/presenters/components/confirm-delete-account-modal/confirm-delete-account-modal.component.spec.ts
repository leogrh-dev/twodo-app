import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteAccountModalComponent } from './confirm-delete-account-modal.component';

describe('ConfirmDeleteAccountModalComponent', () => {
  let component: ConfirmDeleteAccountModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
