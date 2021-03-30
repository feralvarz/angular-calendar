import { createAction, props } from '@ngrx/store';

const CAL_ACTION = 'CalActions/';

export const CalendarActions = {
  increment: createAction(CAL_ACTION + 'increment'),
};
