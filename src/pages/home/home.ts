import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DeviceManagerProvider } from '../../providers/device-manager/device-manager';
import { NetworkManagerProvider } from '../../providers/network-manager/network-manager';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  params : any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public device: DeviceManagerProvider,
              public networkManager: NetworkManagerProvider,) {
    this.params = {};
    this.params.data = [
        { page: "DataPage", title: "Data" },
        { page: "DevicePage", title: "Device" },
        { page: "NetworkPage", title: "Network" }
      ];
    this.params.events = {
        'onItemClick': function (item: any) {
              console.log("onItemClick");
        }
    };
  } 

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomePage');
  }


}
