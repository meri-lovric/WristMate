import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GridToggleComponent } from '../grid-toggle/grid-toggle.component';

@NgModule({
    declarations: [GridToggleComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,

    ],
    exports: [
        GridToggleComponent
    ]
})
export class GridToggleComponentModule { }
