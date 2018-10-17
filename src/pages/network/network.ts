import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DeviceManagerProvider } from '../../providers/device-manager/device-manager';

import { MapToIterablePipe } from '../../pipes/map-to-iterable/map-to-iterable'

/**
 * Generated class for the NetworkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
  //pipes:[MapToIterablePipe]
})
export class NetworkPage {
  keys : any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public device: DeviceManagerProvider,) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NetworkPage');
	this.getKeys()
  }
  public getKeys(){
    this.keys=Object.keys(this.device.networkManager.peers);
    return this.keys;
  }

}
