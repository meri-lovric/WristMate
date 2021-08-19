import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BLE } from '@ionic-native/ble/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { firebaseConfig } from '../environments/firebase_credentials';
import { ConnectedDeviceComponent } from './connected-device/connected-device.component';
@NgModule({
  declarations: [AppComponent, ConnectedDeviceComponent],
  entryComponents: [ConnectedDeviceComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  providers: [
    BLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
