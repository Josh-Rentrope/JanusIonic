import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevicePage } from './device';4


import { ToggleLayout1Module } from '../../components/toggle/layout-1/toggle-layout-1.module';

@NgModule({
  declarations: [
    DevicePage,
  ],
  imports: [
    IonicPageModule.forChild(DevicePage),
    ToggleLayout1Module,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DevicePageModule {}
