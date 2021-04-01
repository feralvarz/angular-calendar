import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { CalendarService } from 'src/app/services/calendar.service';
import { CalendarServiceMock } from 'src/app/testing/calendar.service.mock';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { EventDialogComponent, IDialogData } from './event-dialog.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;
  let calServiceSpy: Spy<CalendarService>;
  let dialogRefMock: { close: jasmine.Spy };
  let loader: HarnessLoader;
  let dialogDataMock: IDialogData;
  const mockFormBuilder: FormBuilder = new FormBuilder();

  beforeEach(
    waitForAsync(() => {
      calServiceSpy = createSpyFromClass(CalendarService);
      dialogRefMock = jasmine.createSpyObj('dialogRefMock', ['close']);
      dialogDataMock = {
        selectedDate: moment(new Date('04/01/2021')),
      };
      TestBed.configureTestingModule({
        imports: [
          MatAutocompleteModule,
          ReactiveFormsModule,
          MatDatepickerModule,
          MatMomentDateModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          { provide: CalendarService, useValue: calServiceSpy },
          { provide: MAT_DIALOG_DATA, useValue: dialogDataMock },
          { provide: FormBuilder, useValue: mockFormBuilder },
        ],
        declarations: [EventDialogComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
