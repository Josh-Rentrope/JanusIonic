import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroductionWizardPage } from './introduction-wizard';
import { WizardLayout3Module } from '../../components/wizard/layout-3/wizard-layout-3.module';

@NgModule({
  declarations: [
    IntroductionWizardPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroductionWizardPage),
    WizardLayout3Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroductionWizardPageModule {}
