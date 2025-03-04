import {
  AsyncPipe,
  Component,
  DatePipe,
  DecimalPipe,
  Input,
  RouterLink,
  WeatherService,
  inject,
  input,
  switchMap,
  toObservable
} from "./chunk-CFAGC2EV.js";

// angular:jit:template:file:src\app\weather\features\forecasts-list\forecasts-list.component.html
var forecasts_list_component_default = `<div>\r
  <div class="panel panel-default">\r
    @if (forecast$ | async; as forecast) {\r
      <div class="panel-heading">\r
        <h3 class="panel-title">5-day forecast for {{ forecast?.city.name }}</h3>\r
      </div>\r
      <ul class="list-group">\r
        @for (dailyForecast of forecast?.list; track dailyForecast) {\r
          <li class="list-group-item">\r
            {{ dailyForecast.dt * 1000 | date: 'EEEE, MMM d' }}:\r
            {{ dailyForecast.weather[0].main }}\r
            - Min: {{ dailyForecast.temp.min | number: '.0-0' }} - Max: {{ dailyForecast.temp.max | number: '.0-0' }}\r
\r
            <img [src]="dailyForecast.iconUrl" alt="" class="icon" />\r
          </li>\r
        }\r
      </ul>\r
    }\r
  </div>\r
</div>\r
<button class="btn btn-success" [routerLink]="'/'">< Back to main page</button>\r
`;

// angular:jit:style:file:src\app\weather\features\forecasts-list\forecasts-list.component.css
var forecasts_list_component_default2 = "/* src/app/weather/features/forecasts-list/forecasts-list.component.css */\n.icon {\n  width: 45px;\n  height: 45px;\n  position: absolute;\n  right: 20px;\n  top: -2px;\n}\n/*# sourceMappingURL=forecasts-list.component.css.map */\n";

// src/app/weather/features/forecasts-list/forecasts-list.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ForecastsListComponent = class ForecastsListComponent2 {
  constructor() {
    this.weatherService = inject(WeatherService);
    this.zipcode = input.required();
    this.zipcode$ = toObservable(this.zipcode);
    this.forecast$ = this.zipcode$.pipe(switchMap((zipcode) => this.weatherService.getForecastWithIcon(zipcode)));
  }
  static {
    this.propDecorators = {
      zipcode: [{ type: Input, args: [{ isSignal: true, alias: "zipcode", required: true, transform: void 0 }] }]
    };
  }
};
ForecastsListComponent = __decorate([
  Component({
    selector: "app-forecasts-list",
    template: forecasts_list_component_default,
    imports: [AsyncPipe, RouterLink, DecimalPipe, DatePipe],
    styles: [forecasts_list_component_default2]
  })
], ForecastsListComponent);
export {
  ForecastsListComponent
};
//# sourceMappingURL=forecasts-list.component-XJIR3S74.js.map
