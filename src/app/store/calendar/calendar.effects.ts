import { createEffect, ofType, Actions } from '@ngrx/effects';

import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class CalendarEffects {
  constructor(private readonly actions$: Actions) {}
}
