import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  showModal : boolean = true;
  ID : string;
  constructor(public http: HttpClient, public storage: Storage) {
    //console.log('Hello SettingsProvider Provider');
	//this.set("ID","012345678909876543210").then((data) => console.log(data));
	this.get("ID").then((data) => {
		if(data){
			this.ID = data;
		}else{
			this.ID = '0123456789ABCDEF'.split('').map(function(v,i,a){ return i>16 ? null : a[Math.floor(Math.random()*16)] }).join('')
			this.set("ID", this.ID);
		}
	});
	this.get("ShowIntro").then((data) => {
		if(data == false){
			this.showModal = data;
		}else{
			this.showModal = true
			this.set("ShowIntro", false);
		}
	});
  }
  public set(settingName,value){
    return this.storage.set(`setting:${ settingName }`,value);
  }
  public async get(settingName){
    return await this.storage.get(`setting:${ settingName }`);
  }
  public async remove(settingName){
    return await this.storage.remove(`setting:${ settingName }`);
  }
  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

}
