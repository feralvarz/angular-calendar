import { createAction, props } from '@ngrx/store';
import { IMonthInfo } from 'src/app/components/calendar/calendar.component';
import { IEventData } from 'src/app/components/event-dialog/event-dialog.component';

const CAL_ACTION = 'CalActions/';

export const CalendarActions = {
  increment: createAction(CAL_ACTION + 'increment'),
  newEvent: createAction(
    CAL_ACTION + 'new_event',
    props<{ event: IEventData; byMonthInfo: IMonthInfo }>()
  ),
};
