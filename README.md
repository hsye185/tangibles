# Stamp-A-Letter

A children's tangible spelling application

## Overview
Stamp-A-Letter is built with the [Meteor](https://www.meteor.com/) framework. The user interface is created with [Angular JS 1](https://angularjs.org/) and [Angular Material](https://material.angularjs.org/latest/). The tangibles are drawn and touch points recognised with the [Konva.js](http://konvajs.github.io/) library. [Angular UI Router](https://github.com/angular-ui/ui-router) is used to navigate between different pages of the app. [PubSubJS](https://github.com/mroderick/PubSubJS) is used to communication between angular controllers. Data is stored in MongoDB. The Tangibles app can be deployed as a website, an Android app (4.4 and above) or an iOS app.

### Software dependencies
* To build the Android apk you need a computer with an Ubuntu or MacOS operating system. You also need to install Android Studio and the Java JDK. Make sure your environment variables are set correctly. See the [Meteor tutorial](https://www.meteor.com/tutorials/angular/running-on-mobile) for more details.
* To build the iOS version you need a computer with MacOS and XCode.

## Running the App
Install [Meteor](https://www.meteor.com/).

Open a terminal, clone the repository and cd into tangibles.
```bash
git clone [This clone URL]
cd tangibles
```

Download dependencies.
```bash
meteor npm install
```

Starting the Meteor app, see the [Meteor tutorial](https://www.meteor.com/tutorials/angular/running-on-mobile) for more details. Ensure your device is connected to the network.
* Web: `meteor`
* Android: `meteor run android-device`
* iOS: `meteor run ios-device`

Open the application in your brower [http://localhost:3000](http://localhost:3000).

This application was a build up off the previous oroo language preservation app, all files added for the creation of this project are prefixed with "sp".




