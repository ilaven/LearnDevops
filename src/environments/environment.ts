// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultauth: 'fakebackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  // urlPath:"https://portal.myljm.com/Ljmweb/",
  // imageURL: "https://portal.myljm.com/Ljm_image/",
  urlPath:"http://162.242.196.195:92/Ljmweb/",
  imageURL:"http://162.242.196.195:92/Ljm_image/",
  // urlPath:"http://192.168.1.202:8080/Ljmweb/",
  // imageURL:"http://192.168.1.202:8080/Ljm_image/",
  // crmUrl: "https://crm.myljm.com/WebAPI/",
  crmUrl: "http://162.242.196.194:85/WebAPI/",
  crmUrlnew : "http://162.242.196.194:85/CRMWKHIVE/",
  // crmUrl: "http://162.242.196.193/WebAPI/",
  //urlPath:"http://20.1.1.123:8080/Ljmweb/"
  // urlPath:"http://localhost:8080/Ljmweb/"
};
 
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
