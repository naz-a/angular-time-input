import { EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';

import { TimeInputMode } from '../../datatypes/time-input-mode.enum';
import { TimeValueSetOutType } from '../../interfaces/time-value-set-out-type';
import { TimeValueType } from '../../interfaces/time-value-type';


export class TimeValue implements TimeValueType {
    readonly TIME_LIMITS = {
        zero: 0,
        hours: 23,
        minutes: 59,
        seconds: 59,
    };

    protected _hours: number;
    protected _minutes: number;
    protected _seconds: number;

    public exeedHours = new EventEmitter<number>();
    public exeedMinutes = new EventEmitter<number>();
    public exeedSeconds = new EventEmitter<number>();

    public hoursChanged = new EventEmitter<number>();
    public minutesChanged = new EventEmitter<number>();
    public secondsChanged = new EventEmitter<number>();

    constructor(
        public inputMode: TimeInputMode = TimeInputMode.CircularForwarding
    ) {
        this.exeedSeconds
            .pipe(filter((val) => val !== 0))
            .subscribe((data: number) => this.setMinutes(this.minutes + data));
        this.exeedMinutes
            .pipe(filter((val) => val !== 0))
            .subscribe((data: number) => this.setHours(this.hours + data));
    }

    get hours(): number {
        return this._hours;
    }
    setHours(value: number, emitChange = true): TimeValue {
        if (this._hours !== value) {
            const partVal = this._setPart(value, this.TIME_LIMITS.hours);
            this._hours = partVal.value;
            if (this.inputMode === TimeInputMode.CircularForwarding) {
                this.exeedHours.emit(partVal.exeedValue);
            }
            if (emitChange) {
                this.hoursChanged.emit(this._hours);
            }
        }
        return this;
    }
    get minutes(): number {
        return this._minutes;
    }
    setMinutes(value: number, emitChange = true): TimeValue {
        if (this._minutes !== value) {
            const partVal = this._setPart(value, this.TIME_LIMITS.minutes);
            this._minutes = partVal.value;
            if (this.inputMode === TimeInputMode.CircularForwarding) {
                this.exeedMinutes.emit(partVal.exeedValue);
            }
            if (emitChange) {
                this.minutesChanged.emit(this._minutes);
            }
        }
        return this;
    }
    get seconds(): number {
        return this._seconds;
    }
    setSeconds(value: number, emitChange = true): TimeValue {
        if (this._seconds !== value) {
            const partVal = this._setPart(value, this.TIME_LIMITS.seconds);
            this._seconds = partVal.value;
            if (this.inputMode === TimeInputMode.CircularForwarding) {
                this.exeedSeconds.emit(partVal.exeedValue);
            }
            if (emitChange) {
                this.secondsChanged.emit(this._seconds);
            }
        }
        return this;
    }

    get value(): TimeValueType {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
        } as TimeValueType;
    }
    setValue(hours: number, minutes: number, seconds: number): void {
        this.setHours(hours).setMinutes(minutes).setSeconds(seconds);
    }

    protected _setPart(
        value: number,
        maxLimit: number
    ): TimeValueSetOutType {
        let partVal = 0;
        let exeedVal = 0;
        const minLimit = this.TIME_LIMITS.zero;
        const divider = maxLimit + 1;
        switch (this.inputMode) {
            case TimeInputMode.Limit:
                if (value > maxLimit) {
                    partVal = maxLimit;
                } else if (value < minLimit) {
                    partVal = minLimit;
                } else {
                    partVal = value;
                }
                exeedVal = 0;
                break;
            case TimeInputMode.Circular:
                if (value > maxLimit) {
                    partVal = minLimit;
                } else if (value < minLimit) {
                    partVal = maxLimit;
                } else {
                    partVal = value;
                }
                exeedVal = 0;
                break;
            case TimeInputMode.CircularForwarding:
                if (value > maxLimit) {
                    partVal = value % divider;
                    exeedVal = Math.round(value / divider);
                } else if (value < minLimit) {
                    partVal = divider + (value % divider);
                    exeedVal = Math.round(value / divider) - 1;
                } else {
                    partVal = value;
                    exeedVal = 0;
                }
                break;
        }
        return {
            value: partVal,
            exeedValue: exeedVal,
        } as TimeValueSetOutType;
    }
}
