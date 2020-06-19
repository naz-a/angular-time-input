"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'angular-time-input';
        this._actTime = moment();
        this.testTimeInputControl = new forms_1.FormControl(this._actTime);
    }
    Object.defineProperty(AppComponent.prototype, "s", {
        get: function () {
            return { assClass: !!(this.actTime2.minute() % 2) };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "actTime", {
        get: function () {
            return this.testTimeInputControl.value.format('YYYY-MM-DD HH:mm:ss');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "actTime2", {
        get: function () {
            return this._actTime;
        },
        set: function (val) {
            this._actTime = val;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.asd = function (data) {
        console.log('data: ', data);
        this.actTime2 = data;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
