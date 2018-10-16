import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Suite of Sensors, unused for now
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors';

//Individual Sensors
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { DBMeter } from '@ionic-native/db-meter';

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
  SensorData = {
    "Enabled": false ,
    "Sensors":{
      "Acceleration": {
        "Type":"Motion",
        "Member":"accelerationSensor",
        "Enabled":true,
        "Subscriber":null,
        "LastData":null,
        "Image": "assets/images/symbols/Vibration.png",
        "UpdateRate":100, //milliseconds
        "NewData":[],
        "Data":[],
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
    },
    "Snapshots":[]
  };
  constructor(public http: HttpClient, //private sensors: Sensors,
              private accelerationSensor: DeviceMotion,
              private geolocation: Geolocation,
              private dbMeter: DBMeter,
              private networkManager: NetworkManagerProvider
              ) {
	networkManager.deviceData = this;
	
	
    setInterval(() => { 
       this.SendDataOverNetwork(); // Now the "this" still references the component
    }, 10000);
  }
  UpdateSensors(){
    // Watch device acceleration
    let that = this;
    if(this.SensorData.Enabled && this.SensorData.Sensors.Acceleration.Enabled && !this.SensorData.Sensors.Acceleration.Subscriber){
      this.SensorData.Sensors.Acceleration.Subscriber = this.accelerationSensor.watchAcceleration({ 
            frequency: this.SensorData.Sensors.Acceleration.UpdateRate, // Measure every 100ms
            //deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
        }).subscribe((acceleration: DeviceMotionAccelerationData) => {
        that.SensorData.Sensors.Acceleration.LastData = acceleration;
        that.SensorData.Sensors.Acceleration.NewData.push(acceleration);
        //console.log(that.SensorData.Sensors.Acceleration.LastData);
      });
    }
    else if(this.SensorData.Sensors.Acceleration.Subscriber && (!this.SensorData.Enabled || !this.SensorData.Sensors.Acceleration.Enabled)){
      this.SensorData.Sensors.Acceleration.Subscriber.unsubscribe();
      this.SensorData.Sensors.Acceleration.Subscriber = null;
    }
  }
  ToggleDataCollection(){
    //console.log("Hello");
    this.SensorData.Enabled = !this.SensorData.Enabled;
    this.UpdateSensors();
  }
  SendDataOverNetwork(){
    this.networkManager.sendDataToServer({
      "Acceleration":this.SensorData.Sensors.Acceleration.NewData
    });
    this.SensorData.Sensors.Acceleration.Data = this.SensorData.Sensors.Acceleration.Data.concat(this.SensorData.Sensors.Acceleration.NewData);
    this.SensorData.Sensors.Acceleration.NewData = [];
    
  }
  
  


}
