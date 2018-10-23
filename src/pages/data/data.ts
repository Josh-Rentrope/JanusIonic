import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Chart } from 'chart.js';

import { DeviceManagerProvider } from '../../providers/device-manager/device-manager';
/**
 * Generated class for the DataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public device: DeviceManagerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');
  }
  openArchive(archiveName){
	  this.device.GetSpecificIncident(archiveName).then((data) => {
		  //console.log(data);
		  this.navCtrl.push('InspectorPage', data);
	  });
	  //console.log(this.device.GetSpecificIncident(archiveName));
  }
  

}