import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import {Platform} from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

//Suite of Sensors, unused for now
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors';


//Individual Sensors
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { DBMeter } from '@ionic-native/db-meter';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';


import Stats  from 'stats-lite';
import Crypto  from 'crypto-js';

import { NetworkManagerProvider } from '../network-manager/network-manager';
//import { ReportsProvider } from '../reports/reports';
/*
  Generated class for the DeviceManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeviceManagerProvider {

  //Eventually, use these from the ionic native sensors class
  sensorTypes = [
    "PROXIMITY",
    "ACCELEROMETER",
    "GYROSCOPE",
    "ROTATION_VECTOR",
    "ORIENTATION",
    "AMBIENT_TEMPERATURE",
    "LIGHT",
    "PRESSURE",
    "RELATIVE_HUMIDITY",
    "TEMPERATURE" //This is Device Specific Temperature, not atmosphere
  ];
  /*
   var arrayLength = this.sensorTypes.length;
    
      //console.log(this.sensors);
      setInterval(() => { 
         
         for (var i = 0; i < arrayLength; i++) {
           this.sensors.enableSensor(this.sensorTypes[i]);
           let state = this.sensors.getState().then(values => {
              console.log(values);
           });;
         }
         //console.log(state.values());
      }, 1000);
      //
    //console.log(this.sensors);*/
  SensorData : any = {
    "Enabled": false ,
	"Triggered":false ,
	"TriggerMonitor":null ,
    "Sensors":{
      "Acceleration": {
        "Type":"Motion",
        "Member":"accelerationSensor",
        "Enabled":true,
        "Subscriber":null,
        "LastData":null,
        "Image": "assets/images/symbols/Vibration.png",
        "UpdateRate":100, //milliseconds
		"Threshold":0.1,
        "NewData":[],
        "Data":[],
		"Magnitude":[],
      },
      "Sound": {
        "Type":"Sound",
        "Member":"dbMeter",
        "Enabled":true,
        "Subscriber":null,
        "LastData":null,
        "Image": "assets/images/symbols/Microphone.png",
        "UpdateRate":100, //milliseconds
		"Threshold":10,
        "NewData":[],
        "Data":[],
		"Magnitude":[],
      },
      "GPS": {
        "Type":"Spatial",
        "Member":"GPSensor",
        "Enabled":true,
        "Subscriber":null,
        "LastData":null,
        "Image": "assets/images/symbols/Vibration.png",
        "UpdateRate":100, //milliseconds
        "NewData":[],
        "Data":[],
      },
      "Camera": {
        "Type":"Visual",
        "Member":"Camera",
        "Enabled":true,
        "Subscriber":null,
        "LastData":null,
        "Image": "assets/images/symbols/Camera.png",
        "UpdateRate":3000, //milliseconds
		"Options": {
		  width: 1280,
		  height: 1280,
		  quality: 85, 
		  shutterSound: null
		},
        "NewData":[],
        "Data":[],
      },
    },
	"LastIncident":null,
    "Incidents":[]
  };
  Archives:any[] = [];
  constructor(public http: HttpClient, //private sensors: Sensors,
              private accelerationSensor: DeviceMotion,
              private geolocation: Geolocation,
              private dbMeter: DBMeter,
              public networkManager: NetworkManagerProvider,
			  private file: File,
			  private cameraPreview: CameraPreview,
			  public platform: Platform,
			  public settings: SettingsProvider,
			  private androidPermissions: AndroidPermissions
              ) {
	networkManager.deviceData = this;
	
	this.platform.ready().then(() => {

		if(this.platform.is('android'))
        {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
                success => console.log("Permissions Granted"),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
            );

            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
			this.UpdateGPSSensor();
        }
		
	    file.listDir(file.externalDataDirectory,'').then((result)=>{
			//console.log(result);
			this.Archives = result;
			//console.log(this); 
			/*result will have an array of file objects with 
			file details or if its a directory*/
			  for(let file of result){
				if(file.isDirectory == true && file.name !='.' && file.name !='..'){
					// Code if its a folder
				}else if(file.isFile == true){
					// Code if its a file
					let name=file.name // File name
					//let path=file.path // File path
					  file.getMetadata(function (metadata) {
						let size=metadata.size; // Get file size
				  });
				}
			}
	  	});
	});
    setInterval(() => { 
       this.SendDataOverNetwork(); // Now the "this" still references the component
    }, 10000);
	  
  }
  cloneDict(hash) {
    var json = JSON.stringify(hash);
    var object = JSON.parse(json);

    return object;
  }
  SaveIncident(data){ 
  	this.file.writeFile(this.file.externalDataDirectory, data.ID+'.json', JSON.stringify(data), {replace: true})
	 .then(() => {      
	   console.log("Wrote to File", this.file.externalDataDirectory);
		this.Archives.unshift({name: data.ID+'.json'});

	 })
	 .catch((err) => {
	   console.error(err);
	 });

	 
  }
  finishLastIncident(){
	  
	  if(this.SensorData.LastIncident){
		  this.SensorData.LastIncident.endtime = new Date();
		  this.SensorData.Incidents.push(this.SensorData.LastIncident);
		  this.SaveIncident(this.SensorData.LastIncident);
		  this.SensorData.LastIncident = null;
	  }
  }
  createNewIncident(){
	  this.finishLastIncident();
	  this.SensorData.LastIncident = {
		  "ID": '0123456789abcdef'.split('').map(function(v,i,a){ return i>16 ? null : a[Math.floor(Math.random()*16)] }).join(''),//I hate this too
		  "timestamp": new Date(),
		  "Data":{
			  "Acceleration":[],
			  "Sound":[],
			  "Camera":[],
			  "GPS":[]
		  },
		  "Cause":null ,
		  "PeerData":{}
	  }
	  this.UpdateCameraSensor();
	  this.startIncidentMonitor();
  }
  startIncidentMonitor(){
	  if(this.SensorData.TriggerMonitor){
		  clearInterval(this.SensorData.TriggerMonitor);
		  this.SensorData.TriggerMonitor = null;
	  }
	  this.networkManager.getDataFromAndroidNodes();
	  this.SensorData.TriggerMonitor = setInterval(() => {
		  //Checking the variancce in Last Value below threshold (english please)
		  //console.log(this.SensorData.Sensors.Sound.LastData);
		  if((this.SensorData.Sensors.Acceleration.Enabled || this.SensorData.Sensors.Acceleration.LastData.variance < this.SensorData.Sensors.Acceleration.Threshold) && (!this.SensorData.Sensors.Sound.Enabled || this.SensorData.Sensors.Sound.LastData.variance < this.SensorData.Sensors.Sound.Threshold)){
			 console.log("Incident Over",this.SensorData);
			 clearInterval(this.SensorData.TriggerMonitor);
			 this.SensorData.Triggered = false;
			 this.finishLastIncident();
		   }

	  }, 1000);
	  
  }
	
	
  UpdateAccelerationSensor(){
    if(this.SensorData.Enabled && this.SensorData.Sensors.Acceleration.Enabled && !this.SensorData.Sensors.Acceleration.Subscriber){
      this.SensorData.Sensors.Acceleration.Subscriber = this.accelerationSensor.watchAcceleration({ 
            frequency: this.SensorData.Sensors.Acceleration.UpdateRate, // Measure every 100ms
            //deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
        }).subscribe((acceleration) => {
		let newAcceleration :any = acceleration;
		newAcceleration.magnitude = Math.hypot(acceleration.x,acceleration.y,acceleration.z);
		this.SensorData.Sensors.Acceleration.Magnitude.push(newAcceleration.magnitude);
		if(this.SensorData.Sensors.Acceleration.Magnitude.length > 100){
			this.SensorData.Sensors.Acceleration.Magnitude.shift();
			newAcceleration.variance = Stats.variance(this.SensorData.Sensors.Acceleration.Magnitude);
			newAcceleration.average = Stats.mean(this.SensorData.Sensors.Acceleration.Magnitude);
		}
		  
        this.SensorData.Sensors.Acceleration.LastData = newAcceleration;
        this.SensorData.Sensors.Acceleration.NewData.push(newAcceleration);
		if(this.SensorData.Sensors.Acceleration.NewData.length>100){
			this.SensorData.Sensors.Acceleration.Data.push(this.SensorData.Sensors.Acceleration.NewData.shift()); //Feed into Data
			if(!this.SensorData.Triggered){
			   if(this.SensorData.Sensors.Acceleration.Enabled && newAcceleration.variance > this.SensorData.Sensors.Acceleration.threshold){
				   this.createNewIncident();
				   this.SensorData.Triggered = true;
				   this.SensorData.LastIncident.Cause = "Acceleration";
			   }
			}else{				
			    this.SensorData.LastIncident.Data.Acceleration.push(this.SensorData.Sensors.Acceleration.LastData);
			}
		}
		  
        //console.log(that.SensorData.Sensors.Acceleration.LastData);
      });
    }
    else if(this.SensorData.Sensors.Acceleration.Subscriber && (!this.SensorData.Enabled || !this.SensorData.Sensors.Acceleration.Enabled)){
      this.SensorData.Sensors.Acceleration.Subscriber.unsubscribe();
      this.SensorData.Sensors.Acceleration.Subscriber = null;
    }
  }
  UpdateGPSSensor(){
	
	  this.SensorData.Sensors.GPS.Subscriber = this.geolocation.watchPosition().subscribe((data) => {
		if(data.coords !== undefined){
			let newPosition = {
				latitude:data.coords.latitude,
				longitude:data.coords.longitude,
				accuracy:data.coords.accuracy,
				heading:data.coords.heading,
				speed:data.coords.speed,
				timestamp:data.timestamp,
			};
			console.log(newPosition);
			this.SensorData.Sensors.GPS.LastData = newPosition;
			this.SensorData.Sensors.GPS.Data.push(newPosition);
		}

		//console.log(that.SensorData.Sensors.GPS.LastData);
	  });
    
  }
  UpdateSoundSensor(){ 
	if(this.SensorData.Enabled && this.SensorData.Sensors.Sound.Enabled && !this.SensorData.Sensors.Sound.Subscriber){
      this.SensorData.Sensors.Sound.Subscriber = this.dbMeter.start().subscribe((data) => {
		let newValue :any = {
			value: data,
			timestamp: new Date()
		};
		
		this.SensorData.Sensors.Sound.Magnitude.push(data);
		  
		if(this.SensorData.Sensors.Sound.Magnitude.length > 100){
			this.SensorData.Sensors.Sound.Magnitude.shift();
			newValue.variance = Stats.variance(this.SensorData.Sensors.Sound.Magnitude);
			newValue.average = Stats.mean(this.SensorData.Sensors.Sound.Magnitude);
		}
		this.SensorData.Sensors.Sound.LastData = newValue;
        this.SensorData.Sensors.Sound.NewData.push(newValue);		  
		if(this.SensorData.Sensors.Sound.NewData.length>100){
			this.SensorData.Sensors.Sound.Data.push(this.SensorData.Sensors.Sound.NewData.shift()); //Feed into Data
			if(!this.SensorData.Triggered){
			   if(this.SensorData.Sensors.Sound.Enabled && newValue.variance > this.SensorData.Sensors.Sound.Threshold){
				   this.createNewIncident();
				   this.SensorData.Triggered = true;
				   this.SensorData.LastIncident.Cause = "Sound";
			   }
			}else{				
			    this.SensorData.LastIncident.Data.Sound.push(this.SensorData.Sensors.Sound.LastData);
			}
		}
        //console.log(that.SensorData.Sensors.Acceleration.LastData);
      });
    }
    else if(this.SensorData.Sensors.Sound.Subscriber && (!this.SensorData.Enabled || !this.SensorData.Sensors.Sound.Enabled)){
      this.SensorData.Sensors.Sound.Subscriber.unsubscribe();
      this.SensorData.Sensors.Sound.Subscriber = null;
    }
  }	
  UpdateCameraSensor(){
	  
	  
	  if(this.SensorData.Enabled && this.SensorData.Sensors.Camera.Enabled && !this.SensorData.Sensors.Camera.Subscriber){
		const cameraPreviewOpts: CameraPreviewOptions = {
		  x: 0,
		  y: 0,
		  width: window.screen.width,
		  height: window.screen.height,
		  camera: 'front',
		  tapPhoto: true,
		  previewDrag: true,
		  toBack: true,
		  alpha: 1
		};
		this.cameraPreview.startCamera(cameraPreviewOpts).then(
		  (res) => {
			console.log(res)
		  },
		  (err) => {
			console.log(err)
		});


		this.SensorData.Sensors.Camera.Subscriber = setInterval(() => {
			let newValue : any = {};
			if(this.SensorData.Triggered){
				// take a picture
				this.cameraPreview.takePicture(this.SensorData.Sensors.Camera.Options).then((imageData) => {
					 newValue.image = 'data:image/jpeg;base64,' + imageData;
					 newValue.timestamp = new Date();
					 this.SensorData.Sensors.Camera.LastData = newValue;
					 this.SensorData.LastIncident.Data.Camera.push( newValue);
					 this.SensorData.Sensors.Camera.Data.push(newValue);

				}, (err) => {
				  console.log(err);
				  //this.picture = 'assets/img/test.jpg';
				});

			}
		}, this.SensorData.Sensors.Camera.UpdateRate)  ;
		  
        //console.log(that.SensorData.Sensors.Acceleration.LastData);
	  
    }
    else if(this.SensorData.Sensors.Camera.Subscriber && (!this.SensorData.Enabled || !this.SensorData.Sensors.Camera.Enabled)){
		
  	  // Stop the camera preview
	  this.cameraPreview.stopCamera();
      clearInterval(this.SensorData.Sensors.Camera.Subscriber);
      this.SensorData.Sensors.Camera.Subscriber = null;
    }
  }
  UpdateSensors(){
    // Watch device acceleration
    //let that = this;
	this.UpdateAccelerationSensor();
	this.UpdateSoundSensor();
    
  }
	
  ToggleDataCollection(){
    //console.log("Hello");
    this.SensorData.Enabled = !this.SensorData.Enabled;
    this.UpdateSensors();
  }	
  ToggleDevice(deviceName){
	  this.SensorData.Sensors[deviceName].Enabled = !this.SensorData.Sensors[deviceName].Enabled;
	  this.UpdateSensors();
  }
  GetPriorData(query){
	  return {
		  "Acceleration":this.SensorData.Sensors.Acceleration.NewData,
		  "Sound":this.SensorData.Sensors.Sound.NewData,
		  "Camera":this.SensorData.Sensors.Camera.LastData,
		  "GPS":this.SensorData.Sensors.GPS.LastData,
		  "ID":this.settings.ID,
		  "Archives":this.Archives,
		  "Current":this.SensorData.LastIncident,
		  "Incidents":this.SensorData.Incidents,
		  "Configuration":this.GetConfiguration(query)
		  
	  }
  }	
  GetCurrentIncidents(query){
	  return {
		  "Incidents":this.SensorData.Sensors.Incidents,
		  "ID":this.settings.ID
	  }
  }	
  GetIncidentsArchives(query){
	  return {
		  "Archives":this.Archives,
		  "ID":this.settings.ID
	  }
  }		
  async GetSpecificIncident(name){ 
	  //file.listDir
	  let IncidentText;
	  await this.file.readAsText(this.file.externalDataDirectory, name).then((data) => {IncidentText = JSON.parse(data);});
	  return {
		  "Incident": IncidentText,
		  "ID":this.settings.ID
	  }
	  
  }	
  async EraseData(query){ 
	  //file.listDir
	  let IncidentText;
	  await this.file.listDir(this.file.externalDataDirectory,'').then((result)=>{
			//console.log(result);
			this.Archives = result;
			//console.log(this); 
			/*result will have an array of file objects with 
			file details or if its a directory*/ 
			  for(let file1 of result){
				 this.file.removeFile(this.file.externalDataDirectory, file1.name); 
			}
		  	this.Archives = [];
	  	});
	  return {
		  "Incident": IncidentText,
		  "ID":this.settings.ID
	  }
	  
  }	
  GetConfiguration(query){
	  return {
		  "Enabled":this.SensorData.Sensors.Enabled,
		  "Acceleration":this.SensorData.Sensors.Acceleration.Enabled,
		  "Sound":this.SensorData.Sensors.Sound.Enabled,
		  "Camera":this.SensorData.Sensors.Camera.Enabled,
		  "ID":this.settings.ID
	  }
  }
  SendDataOverNetwork(){
	
    this.networkManager.sendDataToServer({
      "Acceleration":this.SensorData.Sensors.Acceleration.NewData,
      "Sound":this.SensorData.Sensors.Sound.NewData,
      "Camera":this.SensorData.Sensors.Sound.LastData,
      "GPS":this.SensorData.Sensors.GPS.LastData,
	  "ID":this.settings.ID
    });
	console.log(this.SensorData);
    
  }
  
  


}
