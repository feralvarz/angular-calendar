import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import {
  EventDialogComponent,
  IDialogData,
  IEventData,
  IEventDialogResult,
} from '../event-dialog/event-dialog.component';
import { Store } from '@ngrx/store';

import { CalendarActions } from '../../store/calendar/calendar.actions';
import { CalendarState } from 'src/app/store/selectors';
import { IAppState } from 'src/app/store/state';
import { tap } from 'rxjs/operators';
import { JsUtils } from '../../store/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import {
  ICalendarState,
  IEventsState,
} from 'src/app/store/calendar/calendar.state';

export interface IMonthInfo {
  monthId: string;
  dayId: string;
}

interface IDayDetail {
  id: string;
  dayNumber: number;
  events: number[];
}

interface IMonth {
  value?: moment.Moment;
  events?: any[];
  days: number[];
}

interface ICurrentMonth extends Omit<IMonth, 'days'> {
  monthId: string;
  days: IDayDetail[];
}

interface ICalendar {
  previousMonth: IMonth;
  currentMonth: ICurrentMonth;
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
    currentMonth: { monthId: '', days: [] },
    nextMonth: { days: [] },
  };

  daysOfWeek: string[] = [];

  /**
   * Behavior subject to update calendar pipe after changes in navigation
   */
  calendarUpdated$: BehaviorSubject<any> = new BehaviorSubject({});

  /**
   * Observable from store state
   */
  calEventsStore$: Observable<IEventsState> = this.store.select(
    CalendarState.selectEvents
  );

  constructor(
    private dialog: MatDialog,
    private store: Store<IAppState>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentMonth = new Date();
    this.daysOfWeek = moment(currentMonth).localeData().weekdays();
    this.fillCalendar(currentMonth);

    combineLatest([this.calEventsStore$, this.calendarUpdated$])
      .pipe(
        tap(([state]) => {
          const cal = { ...this.calendar };
          const id = cal.currentMonth.monthId;
          const eventsInMonth = state.byMonthId[id]?.days;

          // If there are events for current month
          if (eventsInMonth) {
            // Add events to day in calendar
            const daysCopy = { ...cal.currentMonth.days };

            for (const [day, ev] of Object.entries(eventsInMonth)) {
              const dayEvents = ev.map((evId: number) => state.byId[evId]);

              daysCopy[day].events = dayEvents;
            }

            cal.currentMonth.days = daysCopy;
            this.calendar = { ...cal };
            this.cd.markForCheck();
          }
        })
      )
      .subscribe();
  }

  /**
   * Builds days of current month in Calendar
   *
   * @param date Date object as reference to build calendar days
   */
  fillCalendar(date: Date): void {
    this.calendar.previousMonth.days = [];
    this.calendar.nextMonth.days = [];

    const value = moment(date);
    const monthId = value.format('MM/YYYY');

    const from = value.startOf('month');
    const to = from.clone().endOf('month');
    const dayCount = to.clone().add(1, 'day').diff(from, 'days');

    const days = Array.from(Array(dayCount), (x, i) => {
      const dayNumber = i + 1;
      const id = `${value.format('MM')}/${dayNumber}`;
      const newData = {
        id,
        dayNumber,
        events: null,
      };

      return newData;
    });

    this.calendar.currentMonth = {
      monthId,
      value,
      days: JsUtils.arrayToObject(days, 'id'),
    };

    this.fillPreviousDays(from);
    this.fillNextDays(to);
    this.calendarUpdated$.next('calendar updated');
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

  /**
   * Compare fn to return original order of days
   *
   * @param value from pipe
   */
  unsorted(value) {
    return value;
  }

  /**
   * Adds a new event to calendar
   *
   * @param value Data from day that triggered this action
   */
  addEvent(value: IDayDetail) {
    // Setting current time for dialog
    const date = new Date();
    date.setMonth(this.calendar.currentMonth.value.month());
    date.setFullYear(this.calendar.currentMonth.value.year());
    date.setDate(value.dayNumber);

    const data: IDialogData = {
      selectedDate: moment(date),
    };
    this.openDialog(data, value.id);
  }

  /**
   * Edits an Event
   *
   * @param event the event to be updated
   * @param dayId Day ID value from day that triggered this action
   */
  editEvent(event: IEventData, dayId: string) {
    const data: IDialogData = {
      selectedDate: moment.unix(event.id),
      eventData: event,
    };
    this.openDialog(data, dayId);
  }

  /**
   * Open Event dialog
   *
   * @param data Data to be used in dialog, whenEvent data is passed dialog
   * changes action to EDIT
   * @param dayId Day ID value from day that triggered this action
   */
  private openDialog(data: IDialogData, dayId: string) {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (result: IEventDialogResult) => {
        if (result) {
          const byMonthInfo: IMonthInfo = {
            monthId: this.calendar.currentMonth.monthId,
            dayId,
          };
          if (result.action === 'CREATE') {
            this.store.dispatch(
              CalendarActions.newEvent({ event: result.event, byMonthInfo })
            );
          }

          if (result.action === 'EDIT') {
            // If event has changed date details
            if (result.originalID !== result.event.id) {
              this.store.dispatch(
                CalendarActions.deleteEvent({
                  id: result.originalID,
                  byMonthInfo,
                })
              );

              // Creating new monthInfo to update the event in calendar
              const targetDate = moment.unix(result.event.id);
              const updatedDateDetails = {
                monthId: targetDate.format('MM/YYYY'),
                dayId: `${targetDate.format('MM')}/${targetDate.format('D')}`,
              };

              this.store.dispatch(
                CalendarActions.newEvent({
                  event: result.event,
                  byMonthInfo: updatedDateDetails,
                })
              );
            } else {
              // Simple changes in properties
              this.store.dispatch(
                CalendarActions.editEvent({
                  event: result.event,
                })
              );
            }
          }
        }
      },
    });
  }

  /**
   * Fills empty spaces in calendar before current month
   *
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
   *
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
