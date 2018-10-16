import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';


/**
 * Generated class for the IntroductionWizardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-introduction-wizard',
  templateUrl: 'introduction-wizard.html',
})
export class IntroductionWizardPage {
  params: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.params = {};
    var that = this;
    this.params.data = {
        'btnNext': 'Next',
        'btnFinish': 'Finish',
        'btnSkip': '',
        'items': [ 
            {
                backgroundImage: 'assets/images/IntroBG/Slide1.png', 
                title: 'Project U',
                description: 'Interfacing People with the world of Data',
                button: 'Next',
                skip: ''
            },
            {
                backgroundImage: 'assets/images/IntroBG/Slide2.png',
                title: 'Capabilities of the App',
                description: 'This app is configured to track specific sensors in the device. See the data you have retrieved in the Data tab. You may set the algorithms used to modify data in the app through the Device Tab. Other nodes can be configured in the Network Tab',
                button: 'Next',
                skip: ''
            },
            {
                backgroundImage: 'assets/images/IntroBG/Slide3.png',
                title: 'The world is your Oyster',
                description: 'This app is extendable for a wide array of possibilities. For now, you can see a demo of a field array of environmental sensors',
                button: 'Finish',
                skip: ''
            }
        ]
    };
    this.params.events = {
         'onSkip': function(event: any) {
              that.viewCtrl.dismiss();
        },
         'onFinish': function(event: any) {
              that.viewCtrl.dismiss();
        }
    };
    console.log(this);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroductionWizardPage');
  }

}
