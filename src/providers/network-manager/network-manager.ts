import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


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
  constructor(public http: HttpClient, private zeroconf: Zeroconf) {
    // watch for services of a specified type
	let that = this;
	this.peers = [];
    this.zeroconf.watch('_http._tcp.', 'local.').subscribe(result => {
      if (result.action == 'added') {
        //console.log('service added', result.service);
		that.peers.push(result.service);
        console.log('service added', result.service);
		//console.log(that);
      } else {
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
	this.webserver.onRequest = function(request) {
			this.webserver.sendResponse(
				request.requestId,
				{
					status: 200,
					body: '<html>Hello World</html>',
					headers: {
						'Content-Type': 'text/html'
					}
				}
			);
		};
	this.webserver.start();
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
