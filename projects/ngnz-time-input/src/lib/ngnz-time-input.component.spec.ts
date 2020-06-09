import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgnzTimeInputComponent } from './ngnz-time-input.component';

describe('NgnzTimeInputComponent', () => {
  let component: NgnzTimeInputComponent;
  let fixture: ComponentFixture<NgnzTimeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgnzTimeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgnzTimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
