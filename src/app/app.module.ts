import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppSettings } from '../services/app-settings'
import { ToastService } from '../services/toast-service'
import { LoadingService } from '../services/loading-service'

import { Sensors } from '@ionic-native/sensors';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { DBMeter } from '@ionic-native/db-meter';

import { Zeroconf } from '@ionic-native/zeroconf';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeviceManagerProvider } from '../providers/device-manager/device-manager';
import { NetworkManagerProvider } from '../providers/network-manager/network-manager';
import { ReportsProvider } from '../providers/reports/reports';

@NgModule({
  declarations: [MyApp],
  providers: [
    StatusBar, SplashScreen,
    ToastService, LoadingService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },

    Sensors,
    DeviceMotion,
    Geolocation,
    DBMeter,
    Zeroconf,

    DeviceManagerProvider,
    NetworkManagerProvider,
    ReportsProvider,
  ],
  imports: [
      BrowserModule,
      HttpModule, HttpClientModule,
      AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
      AngularFireDatabaseModule, AngularFireAuthModule,
      IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
