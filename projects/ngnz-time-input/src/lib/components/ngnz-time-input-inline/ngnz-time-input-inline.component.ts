import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import * as moment from 'moment';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { CssClassCreator } from '../../classes/css-class-creator/css-class-creator';
import { TimeValue } from '../../classes/time-value/time-value';
import { CssClasses } from '../../datatypes/css-classes';
import { CssClassesDefinition } from '../../datatypes/css-classes-definition';
import { TimeInputMode } from '../../datatypes/time-input-mode.enum';
import { TimeValueType } from '../../interfaces/time-value-type';

/**
 * Time Input Component.
 * The component as a part of UI allows to change time part of Moment data type.
 * It looks and uses like a input field.
 * It is possible to use mouse wheel and/or control buttons to change time.
 * Can be used with [value] attribute or FormControl inside angular reactive form
 * @author Aleksey Nazarenko
 * @version 0.0.1
 */
@Component({
    selector: 'ngnz-time-input-inline',
    templateUrl: './ngnz-time-input-inline.component.html',
    styleUrls: ['./ngnz-time-input-inline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: NgnzTimeInputInlineComponent,
        },
    ],
})
export class NgnzTimeInputInlineComponent
    implements
    ControlValueAccessor,
    MatFormFieldControl<moment.Moment>,
    OnInit,
    OnDestroy,
    // OnChanges,
    DoCheck {
    static nextId = 0;
    readonly BUTTON_HOST_ATTRIBUTES = [
        'mat-button',
        'mat-flat-button',
        'mat-icon-button',
        'mat-raised-button',
        'mat-stroked-button',
        'mat-mini-fab',
        'mat-fab',
    ];
    stateChanges = new Subject<void>();
    protected _timeValue: TimeValue;
    protected _inputValue: moment.Moment;

    protected _hoursControl = new FormControl(null);
    protected _minutesControl = new FormControl(null);
    protected _secondsControl = new FormControl(null);
    public parts: FormGroup = new FormGroup({
        hours: this._hoursControl,
        minutes: this._minutesControl,
        seconds: this._secondsControl,
    });
    protected _placeholder: string;
    protected _required = false;
    protected _disabled = false;
    protected _unsubscribe = new Subject();
    protected readonly _debounceTime = 300;
    _focused = false;
    get focused(): boolean {
        return this._focused;
    }
    set focused(val: boolean) {
        this._focused = val;
    }
    controlType = 'ngnz-time-input-inline';
    autofilled?: boolean;
    @HostBinding() id = [
        this.controlType,
        ++NgnzTimeInputInlineComponent.nextId,
    ].join('-');
    @HostBinding('attr.aria-describedby') describedBy = '';
    @HostBinding('class.floating') get shouldLabelFloat() {
        return this.focused || !this.empty;
    }


    // from Material theme: primary, accent, warn
    @Input() color: string;
    public colorClassName: string;

    // type of control buttons in Material Design: mat-button, mat-raised-button etc.
    @Input() buttonMatType: string;
    public buttonMatTypeClassName: string;


    // additional css classes for input fields of hours, minutes and seconds
    @Input() inputClasses: CssClassesDefinition;
    inputClassesConf: CssClasses = {};


    // additional css classes for control buttons
    @Input() buttonsClasses: CssClassesDefinition;

    // additional css classes for decrease button on the left side of the input fieled
    @Input() buttonDecreaseClasses: CssClassesDefinition;

    // additional css classes for increase button on the right side of the input fieled
    @Input() buttonIncreaseClasses: CssClassesDefinition;
    buttonDecreaseClassesConf: CssClasses = {};
    buttonIncreaseClassesConf: CssClasses = {};

    public cssInp: CssClasses;


    // placeholder // FIXME: is to show when value is not set
    @Input()
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        this._placeholder = placeholder;
    }


    // enum defining of time change mode: Limit, Circular, CircularForwarding
    @Input() inputMode: TimeInputMode = TimeInputMode.CircularForwarding;

    @Input()
    get value(): moment.Moment {
        const out = moment({
            years: this._inputValue.year(),
            months: this._inputValue.month(),
            days: this._inputValue.date(),
            hours: this._timeValue.hours,
            minutes: this._timeValue.minutes,
            seconds: this._timeValue.seconds,
        });
        return out;
    }
    set value(value: moment.Moment) {
        this._inputValue = value;
        const hours = +value.hours();
        const minutes = +value.minutes();
        const seconds = +value.seconds();
        this._timeValue.setHours(hours).setMinutes(minutes).setSeconds(seconds);
        this.detectChangies();
    }
    @Input()
    get required() {
        return this._required;
    }
    set required(req) {
        this._required = coerceBooleanProperty(req);
        this.detectChangies();
    }
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.parts.disable() : this.parts.enable();
        this.detectChangies();
    }

    // one character to separate hours from minutes and minutes from seconds; default is ':'
    @Input()
    get splitter() {
        return this._splitter || ':';
    }
    set splitter(value: string) {
        this._splitter = ('' + value).slice(0);
    }
    protected _splitter;

    // do not show control buttons; normally buttons are shown on focus
    @Input() noButtons = false;

    // always show control buttons; normally buttons are shown on focus
    @Input() showButtons = false;

    // do not show seconds block if it is not necessary
    @Input() noSeconds = false;

    // mat icon name for descrease controll button
    @Input() decreaseBtnIconName = 'remove';

    // mat icon name for increase control button
    @Input() increaseBtnIconName = 'add';

    @Output() timeChange: EventEmitter<moment.Moment> = new EventEmitter<
        moment.Moment
    >();
    protected _timeChange: EventEmitter<moment.Moment> = new EventEmitter<
        moment.Moment
    >();

    @HostListener('timeChange', ['$event'])
    @HostListener('change', ['$event'])
    public _onChange: (_: any) => void = function (_: any): void { };
    public _onTouched: (_: any) => void = function (_: any): void { };

    constructor(
        protected _fm: FocusMonitor,
        protected _elRef: ElementRef<HTMLElement>,
        protected _chDetector: ChangeDetectorRef,
        @Optional() @Self() public ngControl: NgControl
    ) {
        this._timeValue = new TimeValue();
        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
        this._fm
            .monitor(this._elRef.nativeElement, true)
            .subscribe((origin) => {
                if (origin == null) {
                    this._onTouched(this);
                }
                this.focused = !!origin;
                this.detectChangies();
            });

        this._hoursControl.valueChanges
            .pipe(
                filter((data) => +data !== this._timeValue.hours),
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._timeValue.setHours(+data);
            });
        this._timeValue.hoursChanged
            .pipe(
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._hoursControl.setValue(this.padNumber(data));
                this._timeChange.emit(this.value);
            });

        this._minutesControl.valueChanges
            .pipe(
                filter((data) => +data !== this._timeValue.minutes),
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._timeValue.setMinutes(+data);
            });
        this._timeValue.minutesChanged
            .pipe(
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._minutesControl.setValue(this.padNumber(data));
                this._timeChange.emit(this.value);
            });

        this._secondsControl.valueChanges
            .pipe(
                filter((data) => +data !== this._timeValue.seconds),
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._timeValue.setSeconds(+data);
            });
        this._timeValue.secondsChanged
            .pipe(
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this._secondsControl.setValue(this.padNumber(data));
                this._timeChange.emit(this.value);
            });

        this._timeChange
            .pipe(
                debounceTime(this._debounceTime),
                takeUntil(this._unsubscribe.asObservable())
            )
            .subscribe((data) => {
                this.timeChange.emit(data);
            });
    }
    ngOnInit() {
        this._timeValue.inputMode = this.inputMode;
        this._cssClassChange();
    }

    ngDoCheck() {
        this._cssClassChange();
    }
    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
        this._fm.stopMonitoring(this._elRef.nativeElement);
    }

    detectChangies() {
        this.stateChanges.next();
        this._cssClassChange();
        this._chDetector.detectChanges();
    }
    get errorState() {
        return !!(
            !!this.ngControl &&
            this.ngControl.touched &&
            this.ngControl.invalid
        );
    }
    get empty() {
        const value = this.parts.value as TimeValueType;
        return (
            !(value.hours && value.hours >= 0) &&
            !(value.minutes && value.minutes >= 0) &&
            !(value.seconds && value.minutes >= 0)
        );
    }
    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(' ');
    }
    onContainerClick(event: MouseEvent): void {
    }

    writeValue(value: moment.Moment): void {
        this.value = value;
    }
    registerOnChange(fn: any): void {
        this._onChange = (_: any) => {
            fn(_);
        };
    }
    registerOnTouched(fn: any): void {
        this._onTouched = (_: any) => {
            fn(_);
        };
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    btnsAction(partName: string, step: number) {
        switch (partName) {
            case 'hours':
                this._timeValue.setHours(this._timeValue.hours + step);
                break;
            case 'minutes':
                this._timeValue.setMinutes(this._timeValue.minutes + step);
                break;
            case 'seconds':
                this._timeValue.setSeconds(this._timeValue.seconds + step);
                break;
        }
        this.detectChangies();
    }
    btnIncrease($event: MouseEvent, partName: string) {
        $event.preventDefault();
        $event.stopPropagation();
        this.btnsAction(partName, 1);
    }

    btnDecrease($event: MouseEvent, partName: string) {
        $event.preventDefault();
        $event.stopPropagation();
        this.btnsAction(partName, -1);
    }

    padNumber(value: number, places: number = 2): string {
        return String(value).padStart(places, '0');
    }

    wheel($event: WheelEvent, partName: string) {
        if (this.focused) {
            $event.preventDefault();
            $event.stopPropagation();
            const step = $event.deltaY > 0 ? -1 : $event.deltaY < 0 ? 1 : 0;
            this.btnsAction(partName, step);
        }
    }

    // rearrange additional and conditional classes
    protected _cssClassChange() {
        this._defineCssButtons();
        this._defineCssInputs();
    }

    // detect type of control buttons in material design
    protected _defineMatButtonType() {
        const out = this.buttonMatTypeClassName = (!!this.buttonMatType && ('' + this.buttonMatType))
            || this.BUTTON_HOST_ATTRIBUTES.filter((attribute) => {
                return this._elRef.nativeElement.hasAttribute(attribute);
            }).join(' ');
        return out;
    }
    // detect color of control buttons in material design
    protected _defineMatButtonColor() {
        return this.colorClassName = !!this.color ? 'mat-' + this.color : '';
    }

    // combine additional and conditional classes for control buttons
    protected _defineCssButtons(): void {
        const cssClasses: CssClasses = new CssClassCreator()
            .appendCssClasses(this.colorClassName || this._defineMatButtonColor())
            .appendCssClasses(this.buttonMatTypeClassName || this._defineMatButtonType())
            .appendCssClasses(this.buttonsClasses)
            .generate();

        const cssCreatorLeft = new CssClassCreator()
            .appendCssClasses(this.buttonDecreaseClasses)
            .appendCssClasses(cssClasses);
        const cssCreatorRight = new CssClassCreator()
            .appendCssClasses(this.buttonIncreaseClasses)
            .appendCssClasses(cssClasses);
        Object.assign(this.buttonDecreaseClassesConf, cssCreatorLeft.generate());
        Object.assign(this.buttonIncreaseClassesConf, cssCreatorRight.generate());
    }

    // combine additional and conditional classes for inputs
    protected _defineCssInputs(): void {
        const cssCreator = new CssClassCreator()
            .appendCssClasses({
                'ngnz-lr-margin-1em': () => (!this.showButtons && !this.noButtons && !this.focused),
            })
            .appendCssClasses(this.inputClasses);
        Object.assign(this.inputClassesConf, cssCreator.generate());
    }
}
