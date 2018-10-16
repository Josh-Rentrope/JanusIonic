import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AppearanceAnimationLayout4Module } from '../../components/list-view/appearance-animation/layout-4/appearance-animation-layout-4.module';
import { TabsLayout1Module } from '../../components/tabs/layout-1/tabs-layout-1.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AppearanceAnimationLayout4Module,
    TabsLayout1Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
