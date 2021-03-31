import { createReducer, on } from '@ngrx/store';
import { CalendarActions } from './calendar.actions';
import { initialCalendarState } from './calendar.state';
import { JsUtils } from '../utils';

const calendarReducer = createReducer(
  initialCalendarState,
  on(CalendarActions.newEvent, (state, { event, byMonthInfo: info }) => {
    const events = JsUtils.createCopy(state.events);
    events.byId[event.id] = event;

    // when month is undefined in store
    if (events.byMonthId[info.monthId] === undefined) {
      events.byMonthId[info.monthId] = {
        days: {
          [info.dayId]: [event.id],
        },
      };
    } else {
      // when day is undefined in state
      if (events.byMonthId[info.monthId].days[info.dayId] === undefined) {
        events.byMonthId[info.monthId].days[info.dayId] = [event.id];
      } else {
        events.byMonthId[info.monthId].days[info.dayId].push(event.id);
      }
    }

    return { ...state, events };
  })
);

export function calendarStateReducer(state, action) {
  return calendarReducer(state, action);
}
