import { Component } from '@angular/core';
import { CurrentConditionsComponent } from './components/current-conditions/current-conditions.component';
import { ZipcodeEntryComponent } from './components/zipcode-entry/zipcode-entry.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
})
export class MainPageComponent {}
