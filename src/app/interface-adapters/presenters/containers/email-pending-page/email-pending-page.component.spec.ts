import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPendingPageComponent } from './email-pending-page.component';

describe('EmailPendingPageComponent', () => {
  let component: EmailPendingPageComponent;
  let fixture: ComponentFixture<EmailPendingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailPendingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailPendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
