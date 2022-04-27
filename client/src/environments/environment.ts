declare const require: any;

export const environment = {
  production: false,
  appVersion: require('../../../package.json').version,
  firebaseConfig: {
    apiKey: 'AIzaSyBXScCuUCkeN8-F5LUhJVOgX79iXwcJRGY',
    authDomain: 'etodo-a2887.firebaseapp.com',
    projectId: 'etodo-a2887',
    storageBucket: 'etodo-a2887.appspot.com',
    messagingSenderId: '1052682981828',
    appId: '1:1052682981828:web:485e0eec3702edb5229491',
    measurementId: 'G-SH705BJ5QX',
  },
};
