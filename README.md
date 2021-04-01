# CalendarApp Coding Challenge

## Demo

URL: [Calendar Coding Challenge](https://feral-dev-demo-calendar-app.herokuapp.com/)

**Note:** [Read CORS section](#cors).

## Description

This project is designed to test your knowledge of front-end web technologies and assess the ability to create front-end UI products with attention to details, cross-browser compatibility, standards, and reusability.

## Assignment

The goal of this exercise is to create a demo calendar application using React, Vue or Angular.

### Mandatory Features

- Ability to add a new "reminder" (max 30 chars) for a user entered day and time. Also,
  include a city.
- Display reminders on the calendar view in the correct time order
- Allow the user to select color when creating a reminder and display it appropriately.
- Ability to edit reminders – including changing text, city, day, time and color.
- Add a weather service call from a free API, and get the weather forecast (ex. Rain) for the date of the calendar reminder based on the city.
- Unit test the functionality: Ability to add a new "reminder" (max 30 chars) for a user
  entered day and time. Also, include a city.

### Bonus (Optional)

- Expand the calendar to support more than the current month.
- Properly handle overflow when multiple reminders appear on the same date.
- Functionality to delete one reminder for a specific day
- Functionality to delete ALL the reminders for a specific day `(pending feature)`
- Autocomplete feature for cities input `(extra)`
- Styles to Weather section `(extra)`
- Unit tests for every component `(extra)`

### Considerations

- Redux (or any other state manager) structure of the calendar
- The project is totally focused on the front-end; please ignore the back-end.
- Keep your code versioned with Git
- Feel free to use small helper libraries for:
  - UI Elements.
  - Date/Time handling.
- You must create the calendar component yourself. Do not use calendar libraries like
  FullCalendar or Bootstrap Calendar
- If you use an external API, make sure to provide working API keys.

---

## Installation

Run `npm install` from root folder.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

**Note:** [Read CORS section](#cors).

## <a name="cors">🙃</a> Cors

**Note:** You will need a proxy to get rid of CORS errors while doing requests to weather api.

I used `Allow CORS: Access-Control-Allow-Origin` to solve CORS, both local and production.

### Links

- [Allow-Cors Chrome extension](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)

- [Allow-Cors how to use](https://mybrowseraddon.com/access-control-allow-origin.html)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
