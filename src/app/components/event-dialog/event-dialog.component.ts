import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

type DialogAction = 'EDIT' | 'CREATE';

export interface IEventData {
  id: number;
  reminder: string;
  city: string;
  color: string;
  time: string;
}

export interface IDialogData {
  selectedDate: moment.Moment;
  eventData?: IEventData | null;
}

export interface IEventDialogResult {
  action: DialogAction;
  event: IEventData;
  originalID: number;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.dialogAction = this.data?.eventData ? 'EDIT' : 'CREATE';
    this.setupForm();
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
    };

    const result: IEventDialogResult = {
      action: this.dialogAction,
      event,
      originalID: this.data?.eventData?.id,
    };

    this.dialogRef.close(result);
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
      date: [selectedDate, { validators: [Validators.required] }],
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
