# JanusIonic
This is a repository for Janus Ionic app, which runs on android phones
This installation is primarily for linux, but windows may work as well. You can also just use the included apk.

## Installation
First, set up Android Studio and the sdk manager. Here are instructions for [Linux](https://medium.com/@aashimad1/install-android-studio-in-ubuntu-b8aed675849f)

Make sure that you have android studio, gradle, and the sdkmanager in your path.

From the SDK manager, install Platform API level 26; Android SDK Tools, Platform-Tools, and Build-Tools; NDK; Google Play Services; Android Support Repository; and the Google Repository.

Setup the [node environment](https://www.npmjs.com/get-npm)

Install Ionic and Cordova using `npm i -g ionic cordova`

Clone this directory and `cd` into the directory

`npm i` to install the Node libraries

Run `ionic cordova build android` to generate an apk or `ionic cordova run android` with a device connected.

## Usage

The App will start with an introductory screen. On the first panel of the app, you'll see "Recent Records" and "Incident Archives".

Clicking on the Device panel will show you the configuration of your devices. Right now it has been simplified to motion, sound and visuals.

Before clicking on the enable device, you can configure the sensors you want to use. (If you choose to use the camera, you may want to lower your volume since it interferes with the microphone.)

The Network Panel will show you other node on the network.

After enabling the device for sensing, you may shake the device or make a loud sound next to the device to trigger an "incident". This basically tells the phone to get information from its peers and to start capturing images of the scene. After a moment of inactivity (no motion and low sound), it will end its trigger state and put the data into an archive. It will show up as recent records.

Restarting the app will show any previous records as incident archives. These archives are able to be inspected with the Janus React Nodes.

### More Issues

There are still a few bugs I'm working out with the networking. For the target phone for the competition, zeroconf seems to work decently well, but lesser power phones may have issues registering and publishing services. More testing and thorough design would be one of the next steps.

