import {
  FormBuilder,
  FormsModule,
  LocationService,
  LocationWeatherService,
  ReactiveFormsModule,
  Validators
} from "./chunk-XUK2OPRI.js";
import {
  Component,
  ContentChildren,
  DecimalPipe,
  Input,
  NgTemplateOutlet,
  Output,
  RouterLink,
  ViewChild,
  WeatherService,
  booleanAttribute,
  catchError,
  contentChildren,
  inject,
  input,
  map,
  model,
  of,
  output,
  take,
  viewChild
} from "./chunk-7T4MAIBC.js";

// angular:jit:template:file:src\app\weather\features\main-page\main-page.component.html
var main_page_component_default = `<div class="container-fluid">\r
  <app-zipcode-entry (addZipcode)="addLocation($event)"></app-zipcode-entry>\r
  @if (currentConditionsByZip(); as currentConditionsByZip) {\r
    <app-tab-group (onTabClosed)="removeLocationByIndex($event)">\r
      @for (currentCondition of currentConditionsByZip; track currentCondition.zip) {\r
        <app-tab [closeable]="true" [title]="currentCondition.data?.name + ' (' + currentCondition.zip + ')'">\r
          <app-current-conditions [currentConditionByZip]="currentCondition" />\r
        </app-tab>\r
      }\r
    </app-tab-group>\r
  }\r
</div>\r
`;

// angular:jit:template:file:src\app\weather\features\main-page\zipcode-entry\zipcode-entry.component.html
var zipcode_entry_component_default = '<form class="well" [formGroup]="form" (submit)="submit()">\n  <h2>Enter a zipcode:</h2>\n  <input type="text" formControlName="zipcode" placeholder="Zipcode" class="form-control" />\n  @if (form.controls.zipcode.invalid && (form.controls.zipcode.touched || form.controls.zipcode.dirty)) {\n    @if (form.controls.zipcode.errors?.required) {\n      <p>Zipcode is required.</p>\n    }\n    @if (form.controls.zipcode.errors?.pattern) {\n      <p>Please enter a valid zipcode.</p>\n    }\n    @if (form.controls.zipcode.errors?.locationAlreadyExists) {\n      <p>Location already in list.</p>\n    }\n    @if (form.controls.zipcode.errors?.weatherNotAvailable) {\n      <p>Weather not available for this location.</p>\n    }\n  }\n  <br />\n  <button class="btn btn-primary" type="submit">Add location</button>\n</form>\n';

// src/app/shared/validators/location.validator.ts
var LocationValidator = class {
  /**
   * Check if the location is already registered
   * @param locationService The location service
   * @returns An async validator function that checks if the location is already registered
   */
  static checkIfLocationAlreadyRegistered(locationService) {
    return (control) => {
      return locationService.locations$.pipe(map((locations) => locations.includes(control.value) ? { locationAlreadyExists: true } : null), take(1));
    };
  }
};

// src/app/shared/validators/weather.validator.ts
var WeatherValidator = class {
  /**
   * Check if the weather is available for the location
   */
  static checkIfWeatherAvailable(weatherService) {
    return (control) => {
      return weatherService.getCurrentConditions(control.value).pipe(map((forecast) => forecast ? null : { weatherNotAvailable: true }), catchError(() => of({ weatherNotAvailable: true })));
    };
  }
};

// src/app/weather/features/main-page/zipcode-entry/zipcode-entry.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ZipcodeEntryComponent = class ZipcodeEntryComponent2 {
  constructor() {
    this.locationService = inject(LocationService);
    this.weatherService = inject(WeatherService);
    this.fb = inject(FormBuilder);
    this.addZipcode = output();
    this.form = this.fb.group({
      zipcode: [
        "",
        [Validators.required, Validators.pattern(/^\d{5}(?:-\d{4})?$/)],
        [
          LocationValidator.checkIfLocationAlreadyRegistered(this.locationService),
          WeatherValidator.checkIfWeatherAvailable(this.weatherService)
        ]
      ]
    });
  }
  submit() {
    if (!this.form.valid)
      return;
    const { zipcode } = this.form.value;
    this.addZipcode.emit(zipcode);
  }
  static {
    this.propDecorators = {
      addZipcode: [{ type: Output, args: ["addZipcode"] }]
    };
  }
};
ZipcodeEntryComponent = __decorate([
  Component({
    selector: "app-zipcode-entry",
    template: zipcode_entry_component_default,
    imports: [FormsModule, ReactiveFormsModule]
  })
], ZipcodeEntryComponent);

// angular:jit:template:file:src\app\weather\features\main-page\current-conditions\current-conditions.component.html
var current_conditions_component_default = `@if (currentConditionByZip(); as location) {\r
  <div class="well flex">\r
    <div>\r
      <h3>{{ location.data.name }} ({{ location.zip }})</h3>\r
      <h4>Current conditions: {{ location.data.weather[0].main }}</h4>\r
      <h4>Temperatures today:</h4>\r
      <p>\r
        Current {{ location.data.main.temp | number: '.0-0' }} - Max\r
        {{ location.data.main.temp_max | number: '.0-0' }} - Min {{ location.data.main.temp_min | number: '.0-0' }}\r
      </p>\r
      <p>\r
        <a [routerLink]="['/forecast', location.zip]">Show 5-day forecast for {{ location.data.name }}</a>\r
      </p>\r
    </div>\r
    <div>\r
      <img [src]="location.data.iconUrl" alt="" />\r
    </div>\r
  </div>\r
}\r
`;

// angular:jit:style:file:src\app\weather\features\main-page\current-conditions\current-conditions.component.css
var current_conditions_component_default2 = "/* src/app/weather/features/main-page/current-conditions/current-conditions.component.css */\n.close {\n  cursor: pointer;\n}\n.flex {\n  display: flex;\n  justify-content: space-between;\n}\n/*# sourceMappingURL=current-conditions.component.css.map */\n";

// src/app/weather/features/main-page/current-conditions/current-conditions.component.ts
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CurrentConditionsComponent = class CurrentConditionsComponent2 {
  constructor() {
    this.currentConditionByZip = input.required();
  }
  static {
    this.propDecorators = {
      currentConditionByZip: [{ type: Input, args: [{ isSignal: true, alias: "currentConditionByZip", required: true, transform: void 0 }] }]
    };
  }
};
CurrentConditionsComponent = __decorate2([
  Component({
    selector: "app-current-conditions",
    template: current_conditions_component_default,
    imports: [RouterLink, DecimalPipe],
    styles: [current_conditions_component_default2]
  })
], CurrentConditionsComponent);

// angular:jit:template:file:src\app\shared\components\tab-group\tab-group.component.html
var tab_group_component_default = '<div>\r\n  <ul>\r\n    @for (tab of tabs(); track tab.id; let index = $index) {\r\n      <li>\r\n        <button type="button" (click)="selectTab(index)">\r\n          {{ tab.title() }}\r\n        </button>\r\n        @if (tab.closeable()) {\r\n          <button type="button" (click)="closeTab(index)">&times;</button>\r\n        }\r\n      </li>\r\n    }\r\n  </ul>\r\n  <div>\r\n    @if (tabs()[selectedIndex()]?.content()) {\r\n      <ng-container *ngTemplateOutlet="tabs()[selectedIndex()]?.content()"></ng-container>\r\n    }\r\n  </div>\r\n</div>\r\n';

// angular:jit:style:file:src\app\shared\components\tab-group\tab-group.component.css
var tab_group_component_default2 = "/* src/app/shared/components/tab-group/tab-group.component.css */\nul {\n  display: flex;\n  flex-wrap: wrap;\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\nli {\n  background-color: #617aa0;\n  color: #fff;\n  border: solid 1px #e3e3e3;\n  padding: 5px 10px;\n  display: flex;\n  gap: 5px;\n}\nbutton {\n  background: none;\n  color: inherit;\n  border: none;\n  padding: 0;\n  font: inherit;\n  cursor: pointer;\n}\n/*# sourceMappingURL=tab-group.component.css.map */\n";

// angular:jit:template:file:src\app\shared\components\tab-group\tab\tab.component.html
var tab_component_default = "<ng-template #contentTemplate><ng-content></ng-content></ng-template>\r\n";

// src/app/shared/components/tab-group/tab/tab.component.ts
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TabComponent_1;
var TabComponent = class TabComponent2 {
  constructor() {
    this.id = TabComponent_1.ID++;
    this.title = input();
    this.closeable = input(false, { transform: booleanAttribute });
    this.content = viewChild("contentTemplate");
  }
  static {
    TabComponent_1 = this;
  }
  static {
    this.ID = 0;
  }
  static {
    this.propDecorators = {
      title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false, transform: void 0 }] }],
      closeable: [{ type: Input, args: [{ isSignal: true, alias: "closeable", required: false, transform: void 0 }] }],
      content: [{ type: ViewChild, args: ["contentTemplate", { isSignal: true }] }]
    };
  }
};
TabComponent = TabComponent_1 = __decorate3([
  Component({
    selector: "app-tab",
    template: tab_component_default
  })
], TabComponent);

// src/app/shared/components/tab-group/tab-group.component.ts
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TabGroupComponent = class TabGroupComponent2 {
  constructor() {
    this.tabs = contentChildren(TabComponent);
    this.selectedIndex = model(0);
    this.onTabClosed = output();
  }
  /**
   * Select a tab
   * @param index The index of the tab to select
   * @param tab The tab to select
   */
  selectTab(index) {
    this.selectedIndex.set(index);
  }
  /**
   * Close the tab
   * @param tab The tab to close
   */
  closeTab(index) {
    if (this.selectedIndex() === index) {
      this.selectedIndex.set(0);
    }
    this.onTabClosed.emit(index);
  }
  static {
    this.propDecorators = {
      tabs: [{ type: ContentChildren, args: [TabComponent, { isSignal: true }] }],
      selectedIndex: [{ type: Input, args: [{ isSignal: true, alias: "selectedIndex", required: false }] }, { type: Output, args: ["selectedIndexChange"] }],
      onTabClosed: [{ type: Output, args: ["onTabClosed"] }]
    };
  }
};
TabGroupComponent = __decorate4([
  Component({
    selector: "app-tab-group",
    template: tab_group_component_default,
    imports: [NgTemplateOutlet],
    styles: [tab_group_component_default2]
  })
], TabGroupComponent);

// src/app/weather/features/main-page/main-page.component.ts
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MainPageComponent = class MainPageComponent2 {
  constructor() {
    this.locationService = inject(LocationService);
    this.locationWeatherService = inject(LocationWeatherService);
    this.currentConditionsByZip = this.locationWeatherService.getCurrentConditions;
  }
  /**
   * Remove a location from the list of locations
   * @param index The index of the location to remove
   */
  removeLocationByIndex(index) {
    const zip = this.currentConditionsByZip()[index].zip;
    this.locationService.removeLocation(zip);
  }
  /**
   * Add a location to the list of locations
   * @param zipcode The zipcode to add
   */
  addLocation(zipcode) {
    this.locationService.addLocation(zipcode);
  }
};
MainPageComponent = __decorate5([
  Component({
    selector: "app-main-page",
    template: main_page_component_default,
    imports: [TabGroupComponent, TabComponent, ZipcodeEntryComponent, CurrentConditionsComponent]
  })
], MainPageComponent);
export {
  MainPageComponent
};
//# sourceMappingURL=main-page.component-K7WMY7LB.js.map
