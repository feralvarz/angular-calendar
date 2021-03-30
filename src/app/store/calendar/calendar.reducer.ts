import { createReducer, on } from '@ngrx/store';
import { CalendarActions } from './calendar.actions';
import { initialCalendarState } from './calendar.state';
import { JsUtils } from '../utils';

const calendarReducer = createReducer(
  initialCalendarState,
  on(CalendarActions.increment, (state) => {
    const calEvents = JsUtils.createCopy(state.events);

    return { ...state, events: calEvents + 1 };
  })
);

export function calendarStateReducer(state, action) {
  return calendarReducer(state, action);
}
