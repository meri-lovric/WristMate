
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';


import { ConnectedDeviceComponent } from './connected-device.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,

    ],
    declarations: [ConnectedDeviceComponent]
})
export class ConnectedDeviceComponentModule { }
