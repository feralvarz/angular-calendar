import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [AppComponent, CalendarComponent],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const app = new AppComponent();
    expect(app).toBeTruthy();
  });
});
