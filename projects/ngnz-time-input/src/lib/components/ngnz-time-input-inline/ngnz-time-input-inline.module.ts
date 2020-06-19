import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgnzTimeInputInlineComponent } from './ngnz-time-input-inline.component';

@NgModule({
    declarations: [NgnzTimeInputInlineComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCommonModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports: [
        NgnzTimeInputInlineComponent
    ],
})
export class NgnzTimeInputInlineModule { }
