import { Component, ElementRef,AfterViewChecked, ViewChild, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook/ngx'

import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewChecked{
  @ViewChild('scrollMe',{static:false})

  private myScrollContainer: ElementRef;
  
  providerFb: firebase.auth.FacebookAuthProvider;
  providerDb: AngularFireDatabase;
  connected = false;
  userId: any;
  userName: any;
  messageText: any;
  messages : any;
  element: HTMLElement;

  ngOnInit() { 
    this.scrollToBottom();
}

  ngAfterViewChecked() {        
    this.scrollToBottom();        
}
scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
} 

  constructor(
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private fb: Facebook,
    public platform: Platform
  ) {
    this.providerFb = new firebase.auth.FacebookAuthProvider();
    this.afAuth.authState.subscribe(auth => {
      if(!auth){
        console.log('Non connecté');
        $('.titleChat').show();
        $('ion-toolbar').hide();

      }else{
        console.log('Utilisateur connecté: ' + auth.uid);
        $('.titleChat').hide();
        $('ion-toolbar').show();

        this.connected = true;
        this.userId = auth.uid;
        this.userName = auth.displayName;
        this.getMessages();
        this.hello();
      }
    });
  }


  facebookLogin() {
    if (this.platform.is('cordova')) {
      this.facebookCordova();
    }else{
      this.facebookWeb();
    }
  }

  facebookCordova(){
    this.fb.login(['Email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
      .then((success) => {
        console.log('Into Facebook: ' + JSON.stringify(success));
        this.afDB.object('Users/' + success.user.uid).set({
          displayName: success.user.displayName,
          photoURL: success.user.photoURL
        });
      }).catch((error) => {
        console.log('Erreur: ' + JSON.stringify(error));
      });
    }).catch((error) => { console.log(error); });
  }

  facebookWeb(){
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((success) => {
        // console.log('Info Facebook: ' + JSON.stringify(success));
        console.log('DisplayName: ' + success.user.displayName);
        console.log('UserID: ' + success.user.uid);
        console.log('photoURL: ' + success.user.photoURL);
        this.afDB.object('Users/ ' + success.user.uid).set({
          displayName: success.user.displayName,
          photoURL: success.user.photoURL
        });
      }).catch((error) => {
        console.log('Erreur: ' + JSON.stringify(error));
      });
  }

  logout(){
    this.afAuth.auth.signOut();
    this.connected = false;
  }


  hello(){
    $( "body" ).keydown(function( event ) {
      if ( event.which == 13 ) {
        $('.submitButton').click();
      };
    });
  };


  sendMessage(){
    console.log('MessageText : '+ this.messageText);
    this.afDB.list('Messages/').push({
      userId: this.userId,
      userName: this.userName,
      text: this.messageText,
      date: new Date().toISOString()
    });
    this.messageText = '';
  }




  getMessages(){
    this.afDB.list('Messages/').snapshotChanges(['child_added']).subscribe(actions => {
      this.messages = [];
      actions.forEach(action =>{
        this.messages.push({
          text: action.payload.exportVal().text,
          userId: action.payload.exportVal().userId,
          date: action.payload.exportVal().date,
        });
      })
    })
  }
  
}
