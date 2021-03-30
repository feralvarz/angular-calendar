import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

export interface IEventData {
  reminder: string;
  city: string;
  color: string;
}

export interface IDialogData {
  selectedDate: Date;
  eventData?: IEventData | null;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private setupForm(): void {
    const selectedDate = moment(this.data.selectedDate);
    const { reminder = '', city = '', color = '#ff9900' } =
      this.data?.eventData || {};

    this.eventForm = this.formBuilder.group({
      reminder: [
        reminder,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      city: [city, { validators: [Validators.required] }],
      color: [color, { validators: [Validators.required] }],
      date: [selectedDate, { validators: [Validators.required] }],
    });
  }
}
