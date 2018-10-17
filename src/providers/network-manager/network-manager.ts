import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';


import { Zeroconf } from '@ionic-native/zeroconf';
/*
  Generated class for the NetworkManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkManagerProvider {
  peers :any;
  webserver: any;
  deviceData: any;
  constructor(public http: HttpClient, private zeroconf: Zeroconf, public plt: Platform) {
    // watch for services of a specified type
	let that = this;
	this.peers = {};
	this.plt.ready().then((readySource) => {
		this.zeroconf.watch('_http._tcp.', 'local.').subscribe(result => {
		  if (result.action == 'added') {
			//console.log('service added', result.service);
			that.peers[result.service.name] = (result.service);
			//console.log('service added', result.service);
			//console.log(that);
		  } else if(result.action == 'resolved') {
			if(result.service.ipv4Addresses){
			  that.peers[result.service.name].ipv4Addresses = result.service.ipv4Addresses;
		  	}
			 
			//console.log('service removed', result.service);
		  }else {
			console.log(result.action);
			console.log('service removed', result.service);
		  }
		});

		// publish a zeroconf service of your own
		this.zeroconf.register('_http._tcp.', 'local.', 'Janus Android Node', 80, {
		  'Group': ''
		}).then(result => {
		  console.log('Service registered', result.service);
		});
		//this.zeroconf.unregister('_http._tcp.', 'local.', 'Becvert\'s iPad');
		this.webserver = cordova.require('cordova-plugin-webserver.webserver');
		this.webserver.onRequest (
			function(request) {
				//console.log("Hello");
				
				var query = {};
				
				//console.log(request);
				if(request.query){
					var pairs = (request.query[0] === '?' ? request.query.substr(1) : request.query).split('&');
					for (var i = 0; i < pairs.length; i++) {
						var pair = pairs[i].split('=');
						query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
					}
				}

				that.webserver.sendResponse(
					request.requestId,
					{
						status: 200,
						body: that.getInformation(query),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				);
			},
			()=>{},
			()=>{}
		);
		console.log(this.webserver);
		this.webserver.start(
			()=>{console.log("Success")},
			(error)=>{console.log("Error"),error},
			8151
		);
	});
	//d console.log(this.webserver);
  }
  getInformation(query){ //Will set this to be autogenerated
    let retDict = {
		Status:null
	};
	  if(query.action){
		  switch(query.action) {
			case "SetProperty":
				if(query.property == "Enabled" && this.deviceData && this.deviceData.SensorData.Enabled != ("true"==query.value)){
					this.deviceData.ToggleDataCollection();
					retDict.Status = "Property Changed";
				}
				break;
			case "GetProperties":
				//code block
				break;
			case "GetData":
				//code block
				break;
			default:
				break
		  }
  	  }
	  
	  return retDict;
  }
  sendDataToServer(postData = {}) {
    var headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    //const requestOptions = new HttpHeaders({ headers: headers });

    this.http.post("http://192.168.47.110:7995/Ingest/", postData, { headers: headers })
    
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);
      });
  }

}
