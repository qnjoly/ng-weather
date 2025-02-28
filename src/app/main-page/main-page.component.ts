import { Component } from '@angular/core';
import { ZipcodeEntryComponent } from '../zipcode-entry/zipcode-entry.component';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
})
export class MainPageComponent {}
