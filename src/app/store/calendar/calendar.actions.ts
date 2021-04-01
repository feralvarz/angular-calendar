import { createAction, props } from '@ngrx/store';
import { IMonthInfo } from 'src/app/components/calendar/calendar.component';
import { IEventData } from 'src/app/components/event-dialog/event-dialog.component';

const CAL_ACTION = 'CalActions/';

export const CalendarActions = {
  newEvent: createAction(
    CAL_ACTION + 'new_event',
    props<{ event: IEventData; byMonthInfo: IMonthInfo }>()
  ),
  editEvent: createAction(
    CAL_ACTION + 'update_event',
    props<{ event: IEventData }>()
  ),
  deleteEvent: createAction(
    CAL_ACTION + 'delete_event',
    props<{ id: number; byMonthInfo: IMonthInfo }>()
  ),
};
