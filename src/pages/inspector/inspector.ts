import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

/**
 * Generated class for the InspectorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inspector',
  templateUrl: 'inspector.html',
})
export class InspectorPage {

  @ViewChild('accelerationCanvas') accelerationCanvas;
  @ViewChild('soundCanvas') soundCanvas;
  accelerationChart: any;
  soundChart: any;

  
  data:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	 this.data = navParams.data;
	 console.log(this.data); 
  }
	
  getAccelerationData(){
	  let retData : any = [[],[],[]];
	  for ( var i = 0; i < this.data.Incident.Data.Acceleration.length; i++ ){
		  retData[0].push(new Date(this.data.Incident.Data.Acceleration[i].timestamp).toTimeString().substr(0,8));
		  retData[1].push(this.data.Incident.Data.Acceleration[i].variance);
		  retData[2].push(this.data.Incident.Data.Acceleration[i].magnitude/9.81);
	  }
	  return retData;
  }
  getSoundData(){
	  let retData : any = [[],[],[]];
	  for ( var i = 0; i < this.data.Incident.Data.Sound.length; i++ ){
		  retData[0].push(new Date(this.data.Incident.Data.Sound[i].timestamp).toTimeString().substr(0,8));
		  retData[1].push(this.data.Incident.Data.Sound[i].variance);
		  retData[2].push(this.data.Incident.Data.Sound[i].value);
	  }
	  return retData;
  }
  ionViewDidLoad() {
	 let accelerationData = this.getAccelerationData();
	 let soundData = this.getSoundData();
	 // console.log(accelerationData);
	 this.accelerationChart = new Chart(this.accelerationCanvas.nativeElement, {
 
            type: 'line',
            data: {
                labels: accelerationData[0], //Time
                datasets: [{
                    label: 'Motion Magnitude',
                    data: accelerationData[2],
                    backgroundColor: [
                        'rgba(132, 99, 255, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(132,99,255,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
				legend: {
					display: false
				},
            }
 
       });
	  this.soundChart = new Chart(this.soundCanvas.nativeElement, {
 
            type: 'line',
            data: {
                labels: soundData[0], //Time
                datasets: [{
                    label: 'Sound Magnitude',
                    data: soundData[2],
                    backgroundColor: [
                        'rgba(132, 99, 255, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(132,99,255,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
				legend: {
					display: false
				},
            }
 
       });
  }

}
