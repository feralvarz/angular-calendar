import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import {
  EventDialogComponent,
  IDialogData,
} from '../event-dialog/event-dialog.component';

interface IMonth {
  value?: moment.Moment;
  events?: any[];
  days: number[];
}

interface ICalendar {
  previousMonth: IMonth;
  currentMonth: IMonth;
  nextMonth: IMonth;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  calendar: ICalendar = {
    previousMonth: { days: [] },
    currentMonth: { days: [] },
    nextMonth: { days: [] },
  };

  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentMonth = new Date();
    this.fillCalendar(currentMonth);
  }

  fillCalendar(date: Date) {
    this.calendar.previousMonth.days = [];
    this.calendar.nextMonth.days = [];

    this.calendar.currentMonth.value = moment(date);
    const from = moment(date).startOf('month');
    const to = from.clone().endOf('month');
    const dayCount = to.clone().add(1, 'day').diff(from, 'days');

    // Creates an array from [1,...,n] days
    this.calendar.currentMonth.days = Array.from(
      Array(dayCount),
      (x, i) => i + 1
    );

    this.fillPreviousDays(from);
    this.fillNextDays(to);
  }

  /**
   * Updates the calendar with next month
   */
  prevMonth(): void {
    this.fillCalendar(
      this.calendar.currentMonth.value.subtract(1, 'month').toDate()
    );
  }

  /**
   * Updates the calendar with previous month
   */
  nextMonth(): void {
    this.fillCalendar(
      this.calendar.currentMonth.value.add(1, 'month').toDate()
    );
  }

  addEvent() {
    const data: IDialogData = {
      selectedDate: new Date(),
      eventData: {
        reminder: 'Lorem Ipsum Data',
        city: 'Miami',
        color: '#ff9900',
      },
    };
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('Dialog closed');
      },
    });
  }

  /**
   * Fills empty spaces in calendar before current month
   * @param from first day of current month used to calculate days
   */
  private fillPreviousDays(from: moment.Moment): void {
    const fromDayIndex = from.weekday();
    if (fromDayIndex > 0) {
      const lastDayPrevMonth = +from.clone().subtract(1, 'day').format('DD');
      for (let i = 0; i < fromDayIndex; i++) {
        this.calendar.previousMonth.days.unshift(lastDayPrevMonth - i);
      }
    }
  }

  /**
   * Fills empty spaces in calendar after current month
   * @param to Last day of current month used to calculate days
   */
  private fillNextDays(to: moment.Moment): void {
    const toDayIndex = to.isoWeekday();
    if (toDayIndex < 6) {
      for (let i = 1; i <= 6 - toDayIndex; i++) {
        this.calendar.nextMonth.days.push(i);
      }
    }
  }
}
