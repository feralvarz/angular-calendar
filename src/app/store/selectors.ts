import { createSelector } from '@ngrx/store';
import { IAppState } from './state';

// Calendar State
export const selectCalendarState = (state: IAppState) => state.calendarState;

/**
 * Calendar state selectors
 */
export const CalendarState = {
  selectEvents: createSelector(selectCalendarState, (state) => {
    return state.events;
  }),
};
