import { IEventData } from '../../components/event-dialog/event-dialog.component';

type EventID = number[];

export interface IEventsState {
  byId: {
    [key: number]: IEventData;
  };
  byMonthId: {
    [key: string]: {
      days: {
        [key: string]: EventID;
      };
    };
  };
}

export interface ICalendarState {
  events: IEventsState;
}

/**
 * Initial Calendar State
 */
export const initialCalendarState: ICalendarState = {
  events: {
    byId: {},
    byMonthId: {},
  },
};
