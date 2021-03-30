import { ActionReducerMap } from '@ngrx/store';
import { calendarStateReducer } from './calendar/calendar.reducer';
import {
  ICalendarState,
  initialCalendarState,
} from './calendar/calendar.state';

export interface IAppState {
  calendarState: ICalendarState;
}

export const appStateReducerMap: ActionReducerMap<IAppState> = {
  calendarState: calendarStateReducer,
};

export const AppState: IAppState = {
  calendarState: initialCalendarState,
};
