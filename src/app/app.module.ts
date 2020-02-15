import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { Facebook } from '@ionic-native/facebook/ngx'

const firebaseConfig = {
  apiKey: "AIzaSyAC9hhqE8FuseqqxmHdltz1pu8MWJwJ1Rw",
  authDomain: "duckchat-1c60b.firebaseapp.com",
  databaseURL: "https://duckchat-1c60b.firebaseio.com",
  projectId: "duckchat-1c60b",
  storageBucket: "duckchat-1c60b.appspot.com",
  messagingSenderId: "895388120428",
  appId: "1:895388120428:web:c38040b80be2c15ee72f49",
  measurementId: "G-4GWWRRYSEL" 
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireDatabase,
    Facebook
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
