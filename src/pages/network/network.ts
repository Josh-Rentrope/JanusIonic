import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NetworkManagerProvider } from '../../providers/network-manager/network-manager';
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
})
export class NetworkPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public networkManager: NetworkManagerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NetworkPage');
  }

}
