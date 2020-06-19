import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgnzTimeInputInlineModule } from 'projects/ngnz-time-input/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        NgnzTimeInputInlineModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
