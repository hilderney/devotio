import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import { IonIconsConst } from './app/core/consts/ion-icons.constant';


bootstrapApplication(
  AppComponent,
  appConfig
).catch((err) => console.error(err));

addIcons(IonIconsConst);

// Carrega os elementos personalizados do Ionic
defineCustomElements(window);
