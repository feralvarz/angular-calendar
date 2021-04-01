import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarComponent } from './calendar.component';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, IAppState } from 'src/app/store/state';
import {
  ICalendarState,
  IEventsState,
  initialCalendarState,
} from 'src/app/store/calendar/calendar.state';
import { CalendarState } from 'src/app/store/selectors';

describe('CalendarComponent', () => {
  let mockStore: MockStore;
  const initialState: ICalendarState = initialCalendarState;
  let selectorCalEvents: MemoizedSelector<IAppState, IEventsState>;
  let eventsMock: IEventsState;

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  function mockStoreResponses() {
    eventsMock = {
      byId: {},
      byMonthId: {},
    };

    // Events selector
    selectorCalEvents = mockStore.overrideSelector(
      CalendarState.selectEvents,
      eventsMock
    );
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [CalendarComponent],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    mockStore = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    mockStoreResponses();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
