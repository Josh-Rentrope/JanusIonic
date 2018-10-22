import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';

import { AppSettings } from '../services/app-settings'
import { ToastService } from '../services/toast-service'
import { LoadingService } from '../services/loading-service'

import { MapToIterablePipe } from '../pipes/map-to-iterable/map-to-iterable'

import { File } from '@ionic-native/file';

import { Sensors } from '@ionic-native/sensors';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { DBMeter } from '@ionic-native/db-meter';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Media } from '@ionic-native/media';

import { Zeroconf } from '@ionic-native/zeroconf';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeviceManagerProvider } from '../providers/device-manager/device-manager';
import { NetworkManagerProvider } from '../providers/network-manager/network-manager';
import { ReportsProvider } from '../providers/reports/reports';
import { SettingsProvider } from '../providers/settings/settings';

@NgModule({
  declarations: [
	  MyApp,
	  MapToIterablePipe
	  
  ],
  providers: [
    StatusBar, SplashScreen,
    ToastService, LoadingService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
	
	AndroidPermissions,
	File,

    Sensors,
    DeviceMotion,
    Geolocation,
    DBMeter,
	CameraPreview,
	Media,
	  
    Zeroconf,

    DeviceManagerProvider,
    NetworkManagerProvider,
    ReportsProvider,
    SettingsProvider,
  ],
  imports: [
      BrowserModule,
      HttpModule, HttpClientModule,
      AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
      AngularFireDatabaseModule, AngularFireAuthModule,
      IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
