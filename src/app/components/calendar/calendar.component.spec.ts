import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarComponent, IDayDetail } from './calendar.component';
import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IAppState } from 'src/app/store/state';
import {
  ICalendarState,
  IEventsState,
  initialCalendarState,
} from 'src/app/store/calendar/calendar.state';
import { CalendarState } from 'src/app/store/selectors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { of } from 'rxjs';

export class MatDialogMock {
  constructor(public returnValue: any) {}

  open() {
    return {
      afterClosed: () => of(this.returnValue),
    };
  }
}

import { defer } from 'rxjs';

/** Async helper functions for use in tests only */
type AsyncDataResolver<T> = () => T;

export function asyncData<T>(data: T | AsyncDataResolver<T>) {
  return defer(() => {
    if (isResolverFn(data)) {
      return Promise.resolve(data());
    }
    return Promise.resolve(data);
  });
}

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

function isResolverFn<T>(
  fn: T | AsyncDataResolver<T>
): fn is AsyncDataResolver<T> {
  return typeof fn === 'function';
}

describe('CalendarComponent', () => {
  const eventFixture = require('../../testing/event.fixture.json');
  const createEvStateFixture = require('../../testing/create-event-state.fixture.json');
  const calFixture = require('../../testing/calendar-apr-2021.fixture.json');

  let mockStore: MockStore;
  const initialState: ICalendarState = initialCalendarState;
  let selectorCalEvents: MemoizedSelector<IAppState, IEventsState>;

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let dialogMock;

  function mockStoreResponses(type: 'initial' | 'create') {
    const mockResponseTypes = {
      initial: {
        byId: {},
        byMonthId: {},
      },
      create: createEvStateFixture,
    };

    // Events selector
    selectorCalEvents = mockStore.overrideSelector(
      CalendarState.selectEvents,
      mockResponseTypes[type]
    );
  }

  beforeEach(
    waitForAsync(() => {
      dialogMock = new MatDialogMock(null);
      TestBed.configureTestingModule({
        imports: [MatDialogModule, BrowserAnimationsModule],
        declarations: [CalendarComponent],
        providers: [
          provideMockStore({ initialState }),
          { provide: MatDialog, useValue: dialogMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    mockStore = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    mockStoreResponses('initial');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new Reminder', fakeAsync(() => {
    mockStoreResponses('create');
    const value: IDayDetail = calFixture.currentMonth.days['04/15'];
    const evId = 1618471800;

    const dialogReturnValue = {
      action: 'CREATE',
      event: eventFixture,
      byMonthInfo: {
        monthId: '04/2021',
        dayId: '04/15',
      },
    };

    const dialogReturnMock = {
      afterClosed: jasmine.createSpy(),
    };
    spyOn(dialogMock, 'open').and.returnValue(dialogReturnMock);
    dialogReturnMock.afterClosed.and.returnValue(asyncData(dialogReturnValue));

    component.addEvent(value);
    component.calEventsStore$.subscribe({
      next: (state) => {
        expect(component.dialog.open).toHaveBeenCalled();
        expect(dialogReturnMock.afterClosed).toHaveBeenCalled();
      },
    });
  }));
});
