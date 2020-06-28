import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { CssClasses, TimeInputMode } from 'projects/ngnz-time-input/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'angular-time-input';

    inputModeLimit = TimeInputMode.Limit;
    inputModeCircular = TimeInputMode.Circular;
    inputModeCircularForwarding = TimeInputMode.CircularForwarding;

    protected _actTime = moment();
    get sClass(): CssClasses {
        return { sClass: !!(this.actTime.minute() % 2) };
    }

    public testTimeInputControl1 = new FormControl(this._actTime);
    public testTimeInputControl2 = new FormControl(this._actTime);
    public testTimeInputControl3 = new FormControl(null);

    public get actTime() {
        return this._actTime;
    }
    public set actTime(val: moment.Moment) {
        this._actTime = val;
    }
    public onTimeChange(data) {
        this.actTime = data;
    }
    public onSetControl1Now() {
        this.testTimeInputControl1.setValue(moment());
    }
    public onSetControl2Now() {
        this.testTimeInputControl2.setValue(moment());
    }
    public onSetActTimeNow() {
        this.actTime = moment();
    }
}
