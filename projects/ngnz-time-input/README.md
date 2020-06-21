# NgnzTimeInput

This is a simple Angular 8 component is to be used to change time as MomentJs.Moment data type.
It is not influence to date part. It allows to change seconds.
You can use it as field in angular reactive form or separately by [value] attribute and (timeChange) event.
It depends on MomentJs, Angular MaterialDesign libraries.

## Input parameters

-   _**color**: string_ - from Material theme: primary, accent, warn;

-   _**buttonMatType**: string_ - type of control buttons in Material Design: mat-button, mat-raised-button etc.

-   _**inputClasses**: string | string[] | {[key:string]:boolean}_ - additional css classes for input fields of hours, minutes and seconds

-   _**inputClasses**: string | string[] | {[key:string]:boolean}_ - additional css classes for control buttons

-   _**buttonDecreaseClasses**: string | string[] | {[key:string]:boolean}_ - additional css classes for decrease button on the left side of the input fieled

-   _**buttonIncreaseClasses**: string | string[] | {[key:string]:boolean}_ - additional css classes for increase button on the right side of the input fieled
-   _**inputMode**: TimeInputMode_ - enum defining of time change mode: 0-Limit, 1-Circular, 2-CircularForwarding
-   _**value**: Moment_ - value
-   _**splitter**: string_ - one character to separate hours from minutes and minutes from seconds; default is ':'
-   _**noButtons**: boolean_ - do not show control buttons; normally buttons are shown on focus
-   _**showButtons**: boolean_ - always show control buttons; normally buttons are shown on focus
-   _**noSeconds**: boolean_ - do not show seconds block if it is not necessary
-   _**decreaseBtnIconName**: string_ - mat icon name for descrease controll button; 'remove' by default
-   _**increaseBtnIconName**: string_ - mat icon name for increase control button; 'add' by default
