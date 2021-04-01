import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skip,
  switchMap,
} from 'rxjs/operators';
import { CalendarService, ICity } from 'src/app/services/calendar.service';

type DialogAction = 'EDIT' | 'CREATE' | 'DELETE';

export interface IEventData {
  id: number;
  reminder: string;
  city: string;
  color: string;
  time: string;
  woeid: number;
}

export interface IDialogData {
  selectedDate: moment.Moment;
  eventData?: IEventData | null;
}

export interface IEventDialogResult {
  action: DialogAction;
  event?: IEventData;
  originalID?: number;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent implements OnInit, AfterViewInit {
  dialogAction: DialogAction;

  /**
   * Form group
   */
  public eventForm: FormGroup;

  get reminderField() {
    return this.eventForm.get('reminder');
  }

  get cityField() {
    return this.eventForm.get('city');
  }

  get colorField() {
    return this.eventForm.get('color');
  }

  get dateField() {
    return this.eventForm.get('date');
  }

  get timeField() {
    return this.eventForm.get('time');
  }

  locations$: Observable<ICity[]>;
  weatherInfo$: Observable<any>;
  whereOnEarthId$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private formBuilder: FormBuilder,
    private service: CalendarService
  ) {}

  ngOnInit() {
    this.dialogAction = this.data?.eventData ? 'EDIT' : 'CREATE';
    this.setupForm();

    this.weatherInfo$ = this.whereOnEarthId$.pipe(
      filter((id) => !!id),
      switchMap((id) => this.service.getLocationWeather(id))
    );

    if (this.dialogAction === 'EDIT') {
      this.whereOnEarthId$.next(this.data.eventData.woeid);
    }
  }

  ngAfterViewInit() {
    this.locations$ = this.cityField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((query: string) => this.service.getCities(query))
    );
  }

  updateWeatherInfo(city: ICity) {
    this.whereOnEarthId$.next(city.woeid);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog and return an event by using dialogRef
   *
   */
  handleSubmit(): void {
    const { reminder, city, color, date, time } = this.eventForm.value;
    const dateStr: string = date.format('MM/DD/YYYY');
    const dateRef = moment(`${dateStr} ${time}`);

    const event: IEventData = {
      id: dateRef.unix(),
      reminder,
      city,
      color,
      time,
      woeid: this.whereOnEarthId$.value,
    };

    const result: IEventDialogResult = {
      action: this.dialogAction,
      event,
      originalID: this.data?.eventData?.id,
    };

    this.dialogRef.close(result);
  }

  handleDelete() {
    this.dialogRef.close({
      action: 'DELETE',
      originalID: this.data?.eventData?.id,
    });
  }

  /**
   * Setup event form with default values or values passed in dialog data
   */
  private setupForm(): void {
    const selectedDate = this.data.selectedDate;
    const { reminder = '', city = '', color = this.defaultColor() } =
      this.data?.eventData || {};

    const time = `${selectedDate.format('HH')}:${selectedDate.format('mm')}`;

    this.eventForm = this.formBuilder.group({
      reminder: [
        reminder,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      city: [city, { validators: [Validators.required] }],
      color: [color, { validators: [Validators.required] }],
      date: [
        { value: selectedDate, disabled: this.dialogAction === 'CREATE' },
        { validators: [Validators.required] },
      ],
      time: [time, { validators: [Validators.required] }],
    });
  }

  /**
   * Generates a random color
   */
  private defaultColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return `#${color}`;
  }
}
